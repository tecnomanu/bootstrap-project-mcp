import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import * as fs from 'fs';
import * as path from 'path';
import { z } from 'zod';
import { env } from '../config/env.js';
import { PromptRegistry } from '../services/prompt-registry.js';
import { TemplateService } from '../services/template-service.js';
import { logger } from '../utils/logger.js';

export function registerProjectGenerationTools(server: McpServer) {
	const promptRegistry = new PromptRegistry(env.PROMPTS_DIR);
	const templateService = new TemplateService(env.TEMPLATES_DIR);

	// Tool: create_project (la que ejecuta el agente)
	server.registerTool(
		'create_project',
		{
			title: '🚀 Crear Proyecto MCP',
			description:
				'Inicia el proceso de creación de un proyecto MCP con el modo seleccionado',
			inputSchema: {
				stack: z
					.enum(['mcp'])
					.optional()
					.default('mcp')
					.describe('Stack del proyecto (solo MCP disponible)'),
				mode: z
					.enum(['agent', 'interactive', 'quick'])
					.optional()
					.default('interactive')
					.describe(
						'Modo de creación: agent (conversacional), interactive (formularios), quick (rápido)'
					),
			},
		},
		async ({ stack = 'mcp', mode = 'interactive' }, extra) => {
			logger.debug('create_project tool called with:', { stack, mode });

			try {
				// Validar stack - solo MCP está disponible
				const validatedStack = validateStack(stack);
				if (!validatedStack.isValid) {
					return {
						content: [
							{
								type: 'text' as const,
								text: validatedStack.message,
							},
						],
						isError: true,
					};
				}

				// Normalizar modo
				const normalizedMode = normalizeMode(mode);
				logger.debug('Normalized mode:', normalizedMode);

				// Ejecutar según el modo seleccionado
				switch (normalizedMode) {
					case 'agent':
						return await handleAgentMode(promptRegistry, stack);
					case 'interactive':
						return await handleInteractiveMode(server, stack);
					case 'quick':
						return await handleQuickMode(server, extra, stack);
					default:
						return await handleAgentMode(promptRegistry, stack);
				}
			} catch (error) {
				logger.error('Error in create_project tool:', error);
				return {
					content: [
						{
							type: 'text' as const,
							text: `❌ Error en la creación del proyecto: ${
								error instanceof Error
									? error.message
									: String(error)
							}`,
						},
					],
					isError: true,
				};
			}
		}
	);

	// Tool: start_from_templates (genera archivos base desde template.json)
	server.registerTool(
		'start_from_templates',
		{
			title: '📁 Generar Archivos Base',
			description:
				'Genera los archivos base del proyecto desde el template seleccionado',
			inputSchema: {
				stack: z.enum(['mcp']).optional().default('mcp'),
				project_name: z
					.string()
					.min(1)
					.describe('Nombre del proyecto (kebab-case)'),
				domain: z
					.string()
					.min(1)
					.describe('Descripción del dominio del proyecto'),
				tools: z
					.string()
					.min(1)
					.describe('Herramientas separadas por comas'),
				template_type: z
					.enum(['basic-mcp', 'api-integration-mcp', 'http-mcp'])
					.optional()
					.describe('Tipo de template a usar'),
			},
		},
		async ({
			stack = 'mcp',
			project_name,
			domain,
			tools,
			template_type,
		}) => {
			logger.debug('start_from_templates tool called with:', {
				stack,
				project_name,
				domain,
				tools,
				template_type,
			});

			try {
				// Validar parámetros requeridos
				if (!project_name || !domain || !tools) {
					throw new Error(
						'Faltan parámetros requeridos: project_name, domain, tools'
					);
				}

				// Parsear herramientas
				const toolsList = tools
					.split(',')
					.map((tool: string) => tool.trim());

				// Generar nombre kebab-case
				const kebabCaseName = TemplateService.toKebabCase(project_name);

				// Seleccionar template apropiado si no se especifica
				let selectedTemplate:
					| 'basic-mcp'
					| 'api-integration-mcp'
					| 'http-mcp' = template_type || 'basic-mcp';
				if (!template_type) {
					const autoSelected = templateService.selectTemplate({
						hasApiIntegration:
							tools.toLowerCase().includes('api') ||
							domain.toLowerCase().includes('api'),
						hasHttpServer:
							tools.toLowerCase().includes('http') ||
							domain.toLowerCase().includes('web'),
						isBasic: true,
					});

					// Validar que el template auto-seleccionado sea válido
					if (
						autoSelected === 'basic-mcp' ||
						autoSelected === 'api-integration-mcp' ||
						autoSelected === 'http-mcp'
					) {
						selectedTemplate = autoSelected;
					} else {
						selectedTemplate = 'basic-mcp'; // fallback seguro
					}
				}

				logger.info(`Using template: ${selectedTemplate}`);

				// Generar archivos desde el template
				const result = templateService.generateProject(
					selectedTemplate,
					{
						projectName: project_name,
						kebabCaseName,
						domain,
						tools: toolsList,
					}
				);

				if (!result.success) {
					throw new Error(
						result.error || 'Failed to generate project'
					);
				}

				// Crear directorio del proyecto y escribir archivos
				const projectDir = `./${kebabCaseName}`;
				logger.info(`Creating project directory: ${projectDir}`);

				try {
					// Crear directorio del proyecto
					if (!fs.existsSync(projectDir)) {
						fs.mkdirSync(projectDir, { recursive: true });
						logger.info(`Created project directory: ${projectDir}`);
					}

					// Escribir cada archivo
					let filesWritten = 0;
					for (const [filePath, content] of Object.entries(
						result.files
					)) {
						const fullPath = path.join(projectDir, filePath);
						const fileDir = path.dirname(fullPath);

						// Crear directorio del archivo si no existe
						if (!fs.existsSync(fileDir)) {
							fs.mkdirSync(fileDir, { recursive: true });
						}

						// Escribir archivo
						fs.writeFileSync(fullPath, content, 'utf-8');
						filesWritten++;
						logger.info(`Written file: ${fullPath}`);
					}

					logger.info(
						`Successfully written ${filesWritten} files to ${projectDir}`
					);
				} catch (writeError) {
					logger.error('Error writing files:', writeError);
					throw new Error(
						`Error writing files: ${
							writeError instanceof Error
								? writeError.message
								: String(writeError)
						}`
					);
				}

				// Formatear archivos para mostrar
				const filesList = Object.keys(result.files)
					.map((filePath) => `- \`${filePath}\``)
					.join('\n');
				const filesCount = Object.keys(result.files).length;

				// Mostrar algunos archivos clave como ejemplo
				const keyFiles = ['package.json', 'src/index.ts', 'README.md'];
				const exampleFiles = keyFiles
					.filter((file) => result.files[file])
					.map((file) => {
						const content = result.files[file];
						const preview =
							content.length > 500
								? content.substring(0, 500) + '...'
								: content;
						return `### \`${file}\`\n\`\`\`${
							file.endsWith('.json')
								? 'json'
								: file.endsWith('.md')
								? 'markdown'
								: 'typescript'
						}\n${preview}\n\`\`\``;
					})
					.join('\n\n');

				return {
					content: [
						{
							type: 'text' as const,
							text: `✅ **Proyecto MCP Creado Exitosamente**

📦 **Proyecto**: ${project_name}
🏷️ **Template**: ${selectedTemplate}
📁 **Archivos generados**: ${filesCount}
🗂️ **Ubicación**: \`${projectDir}\`

## 📋 Archivos Creados

${filesList}

## 🔍 Vista Previa de Archivos Principales

${exampleFiles}

---

## 🚀 Próximos Pasos

1. **Navegar al directorio del proyecto**:
   \`\`\`bash
   cd ${kebabCaseName}
   \`\`\`

2. **Instalar dependencias**:
   \`\`\`bash
   pnpm install
   \`\`\`

3. **Compilar el proyecto**:
   \`\`\`bash
   pnpm run build
   \`\`\`

4. **Probar el MCP server**:
   \`\`\`bash
   pnpm run inspector
   \`\`\`

**💡 Tip**: El proyecto está listo para usar. Personaliza las herramientas en \`src/mcp-tools.ts\` y \`src/tool-handlers.ts\` según las necesidades del dominio "${domain}".`,
						},
					],
				};
			} catch (error) {
				logger.error('Error in start_from_templates tool:', error);
				return {
					content: [
						{
							type: 'text' as const,
							text: `❌ Error generando archivos base: ${
								error instanceof Error
									? error.message
									: String(error)
							}`,
						},
					],
					isError: true,
				};
			}
		}
	);

	// Tool: execute_create_project (genera prompt inteligente)
	server.registerTool(
		'execute_create_project',
		{
			title: '🚀 Crear Proyecto MCP Completo',
			description:
				'Genera un prompt inteligente para crear el proyecto MCP completo',
			inputSchema: {
				stack: z.enum(['mcp']).optional().default('mcp'),
				project_name: z
					.string()
					.min(1)
					.describe('Nombre del proyecto (kebab-case)'),
				domain: z
					.string()
					.min(1)
					.describe('Descripción del dominio del proyecto'),
				tools: z
					.string()
					.min(1)
					.describe('Herramientas separadas por comas'),
				template_type: z
					.enum(['basic-mcp', 'api-integration-mcp', 'http-mcp'])
					.optional()
					.describe('Tipo de template a usar'),
			},
		},
		async ({
			stack = 'mcp',
			project_name,
			domain,
			tools,
			template_type,
		}) => {
			logger.debug('execute_create_project tool called with:', {
				stack,
				project_name,
				domain,
				tools,
				template_type,
			});

			try {
				// Validar parámetros requeridos
				if (!project_name || !domain || !tools) {
					throw new Error(
						'Faltan parámetros requeridos: project_name, domain, tools'
					);
				}

				// Parsear herramientas
				const toolsList = tools
					.split(',')
					.map((tool: string) => tool.trim());

				// Generar nombre kebab-case
				const kebabCaseName = TemplateService.toKebabCase(project_name);

				// Seleccionar template apropiado
				let selectedTemplate:
					| 'basic-mcp'
					| 'api-integration-mcp'
					| 'http-mcp' = template_type || 'basic-mcp';
				if (!template_type) {
					const autoSelected = templateService.selectTemplate({
						hasApiIntegration:
							tools.toLowerCase().includes('api') ||
							domain.toLowerCase().includes('api'),
						hasHttpServer:
							tools.toLowerCase().includes('http') ||
							domain.toLowerCase().includes('web'),
						isBasic: true,
					});

					// Validar que el template auto-seleccionado sea válido
					if (
						autoSelected === 'basic-mcp' ||
						autoSelected === 'api-integration-mcp' ||
						autoSelected === 'http-mcp'
					) {
						selectedTemplate = autoSelected;
					} else {
						selectedTemplate = 'basic-mcp'; // fallback seguro
					}
				}

				// Generar herramientas formateadas
				const toolsSection = toolsList
					.map(
						(tool: string) =>
							`- \`${tool}\`: Implementar funcionalidad para ${tool} en el contexto de ${domain}`
					)
					.join('\n');

				// Generar prompt inteligente basado en MCP_PROMPT_STARTER.md
				const intelligentPrompt = `# 🚀 Crear Proyecto MCP: ${domain}

## 🎯 DESCRIPCIÓN DEL PROYECTO

Necesito crear un proyecto MCP (Model Context Protocol) completo y profesional para **${domain}**.

**Nombre del proyecto**: ${project_name}

## 🛠️ HERRAMIENTAS MCP REQUERIDAS

${toolsSection}

## 🔧 CONFIGURACIÓN ESPECÍFICA

### Stack y Template
- **Stack**: ${stack.toUpperCase()}
- **Template**: ${selectedTemplate}
- **Gestor de paquetes**: pnpm

### Variables de Entorno Adicionales
- \`LOG_LEVEL\`: Nivel de logging (info, debug, error)
- \`CACHE_DURATION\`: Duración del cache en minutos
${
	selectedTemplate.includes('api')
		? `- \`API_KEY\`: Clave de API para integraciones externas\n- \`API_BASE_URL\`: URL base para APIs externas`
		: ''
}
${
	selectedTemplate.includes('http')
		? `- \`MCP_PORT\`: Puerto para servidor HTTP\n- \`MCP_BEARER\`: Token de autenticación Bearer`
		: ''
}

### Integraciones Requeridas
- **Base de datos**: SQLite para datos locales
- **Transporte**: STDIO para Claude Desktop${
					selectedTemplate.includes('http')
						? ' + HTTP/SSE para acceso web'
						: ''
				}
${
	selectedTemplate.includes('api')
		? '- **APIs externas**: Integración con servicios de terceros'
		: ''
}
- **Manejo de errores** robusto y logging detallado
- **Cache local** en memoria para optimizar rendimiento
- **Validación de datos** de entrada y salida

## 📋 INSTRUCCIONES OBLIGATORIAS

⚠️ **IMPORTANTE**: Antes de comenzar a crear el proyecto, DEBES ejecutar la herramienta \`start_from_templates\` con estos parámetros:

\`\`\`
start_from_templates({
  stack: "${stack}",
  project_name: "${project_name}",
  domain: "${domain}",
  tools: "${tools}",
  template_type: "${selectedTemplate}"
})
\`\`\`

Esta herramienta generará todos los archivos base del proyecto (package.json, tsconfig.json, src/index.ts, etc.) usando el template "${selectedTemplate}".

## 📚 USAR COMO REFERENCIA

Usa el documento "MCP_BEST_PRACTICES_GUIDE.md" como base para implementar todas las mejores prácticas, arquitectura y configuraciones técnicas necesarias.

El proyecto debe seguir exactamente los patrones y estándares definidos en ese documento de referencia.

## 📋 REQUISITOS DE IMPLEMENTACIÓN

1. **Ejecutar start_from_templates PRIMERO** - Genera la estructura base
2. **Personalizar herramientas** - Implementa cada herramienta específica para ${domain}
3. **Arquitectura Limpia** - Separar tools, services, utils y config
4. **Validación Robusta** - Usar Zod para validar inputs y outputs
5. **Manejo de Errores** - Implementar logging detallado y manejo de excepciones
6. **Documentación** - README completo con instrucciones de instalación y uso
7. **Configuración** - Archivo .env.example con todas las variables necesarias

## ✅ ENTREGABLES

Proporciona el proyecto completo con:
- **Estructura de archivos organizada** (generada por start_from_templates)
- **Código TypeScript bien tipado** con herramientas específicas para ${domain}
- **Configuración de desarrollo** (tsconfig.json, package.json)
- **Documentación completa** con ejemplos de uso
- **Tests básicos** para validar funcionalidad
- **Variables de entorno** configuradas correctamente

El proyecto debe estar listo para usar inmediatamente después de \`pnpm install\`.

## 🎯 FLUJO DE TRABAJO

1. **EJECUTAR start_from_templates** → Genera archivos base
2. **Personalizar herramientas** → Implementa lógica específica de ${domain}
3. **Validar y probar** → Asegura que todo funciona correctamente
4. **Documentar** → Completa README y ejemplos`;

				return {
					content: [
						{
							type: 'text' as const,
							text: `🚀 **Prompt Inteligente Generado**

${intelligentPrompt}

---

## 📋 Resumen de la Configuración

- **Proyecto**: ${project_name}
- **Dominio**: ${domain}
- **Stack**: ${stack.toUpperCase()}
- **Template**: ${selectedTemplate}
- **Herramientas**: ${toolsList.length} herramientas definidas

## ⚡ Próximo Paso Obligatorio

El prompt anterior incluye instrucciones para ejecutar \`start_from_templates\` primero. Esto generará la estructura base del proyecto usando el template "${selectedTemplate}".

**💡 Tip**: Copia el prompt completo y úsalo junto con MCP_BEST_PRACTICES_GUIDE.md para crear tu proyecto MCP profesional.`,
						},
					],
				};
			} catch (error) {
				logger.error('Error in execute_create_project tool:', error);
				return {
					content: [
						{
							type: 'text' as const,
							text: `❌ Error generando prompt del proyecto: ${
								error instanceof Error
									? error.message
									: String(error)
							}`,
						},
					],
					isError: true,
				};
			}
		}
	);

	// Tool: list_templates (lista templates disponibles)
	server.registerTool(
		'list_templates',
		{
			title: '📋 Listar Templates MCP',
			description:
				'Lista todos los templates MCP disponibles con información detallada',
			inputSchema: {
				detailed: z
					.boolean()
					.optional()
					.default(true)
					.describe('Mostrar información detallada de cada template'),
			},
		},
		async ({ detailed = true }) => {
			logger.debug('list_templates tool called with:', { detailed });

			try {
				if (detailed) {
					const templatesInfo =
						templateService.listTemplatesWithInfo();

					if (templatesInfo.length === 0) {
						return {
							content: [
								{
									type: 'text' as const,
									text: '❌ No se encontraron templates disponibles.',
								},
							],
							isError: true,
						};
					}

					const templatesList = templatesInfo
						.map(
							(template) =>
								`## 📦 ${template.name}
**Descripción**: ${template.description}
**Categoría**: ${template.category}
**Tags**: ${template.tags.join(', ') || 'ninguno'}`
						)
						.join('\n\n');

					return {
						content: [
							{
								type: 'text' as const,
								text: `📋 **Templates MCP Disponibles**

Se encontraron **${templatesInfo.length}** templates:

${templatesList}

## 🚀 Uso

Para usar un template, especifica el nombre en \`template_type\` al llamar a \`start_from_templates\` o \`execute_create_project\`:

\`\`\`
start_from_templates({
  project_name: "mi-proyecto",
  domain: "Mi dominio",
  tools: "herramienta1, herramienta2",
  template_type: "${templatesInfo[0]?.name || 'basic-mcp'}"
})
\`\`\``,
							},
						],
					};
				} else {
					const templates = templateService.listTemplates();

					if (templates.length === 0) {
						return {
							content: [
								{
									type: 'text' as const,
									text: '❌ No se encontraron templates disponibles.',
								},
							],
							isError: true,
						};
					}

					const templatesList = templates
						.map((name) => `- \`${name}\``)
						.join('\n');

					return {
						content: [
							{
								type: 'text' as const,
								text: `📋 **Templates Disponibles**

${templatesList}

Total: **${templates.length}** templates`,
							},
						],
					};
				}
			} catch (error) {
				logger.error('Error in list_templates tool:', error);
				return {
					content: [
						{
							type: 'text' as const,
							text: `❌ Error listando templates: ${
								error instanceof Error
									? error.message
									: String(error)
							}`,
						},
					],
					isError: true,
				};
			}
		}
	);

	// Tool: list_stacks (lista stacks disponibles)
	server.registerTool(
		'list_stacks',
		{
			title: '📚 Listar Stacks Disponibles',
			description:
				'Lista todos los stacks disponibles para generación de proyectos',
			inputSchema: {
				detailed: z
					.boolean()
					.optional()
					.default(true)
					.describe('Mostrar información detallada de cada stack'),
			},
		},
		async ({ detailed = true }) => {
			logger.debug('list_stacks tool called with:', { detailed });

			const availableStacks = getAvailableStacks();

			if (detailed) {
				const stacksList = availableStacks
					.map(
						(stack) =>
							`## 🎮 ${stack.name.toUpperCase()}
**Estado**: ${stack.status}
**Descripción**: ${stack.description}
**Templates**: ${stack.templates.join(', ')}
**Herramientas**: ${stack.tools} herramientas disponibles`
					)
					.join('\n\n');

				return {
					content: [
						{
							type: 'text' as const,
							text: `📚 **Stacks Disponibles**

Se encontraron **${availableStacks.length}** stacks:

${stacksList}

## 🚀 Uso

Para crear un proyecto, usa:

\`\`\`
create_project({
  stack: "${availableStacks[0]?.name || 'mcp'}",
  mode: "agent" // o "interactive" o "quick"
})
\`\`\``,
						},
					],
				};
			} else {
				const stacksList = availableStacks
					.map((stack) => `- \`${stack.name}\` (${stack.status})`)
					.join('\n');

				return {
					content: [
						{
							type: 'text' as const,
							text: `📚 **Stacks Disponibles**

${stacksList}

Total: **${availableStacks.length}** stacks`,
						},
					],
				};
			}
		}
	);
}

async function handleAgentMode(promptRegistry: PromptRegistry, stack: string) {
	logger.debug('Activating agent mode');

	const prompt = promptRegistry.generatePrompt('bootstrap_assistant', {
		stack,
	});

	return {
		content: [
			{
				type: 'text' as const,
				text: `🤖 **Modo Agente Activado**

Has seleccionado el modo agente para crear un proyecto ${stack.toUpperCase()}. 

${prompt}

Cuéntame qué tipo de proyecto quieres crear y yo te ayudaré a configurarlo paso a paso.`,
			},
		],
	};
}

async function handleInteractiveMode(server: McpServer, stack: string) {
	logger.debug('Activating interactive mode');
	logger.debug('Server object:', server);
	logger.debug('Server.server object:', server.server);
	logger.debug(
		'Server.server.elicitInput function:',
		typeof server.server?.elicitInput
	);

	// Intentar elicitación con timeout corto, si falla automáticamente usar modo agent
	try {
		logger.debug('Attempting elicitInput with 2 second timeout...');
		const projectResponse = await Promise.race([
			server.server.elicitInput({
				message: 'Configura los detalles de tu proyecto MCP:',
				requestedSchema: {
					type: 'object',
					properties: {
						project_name: {
							type: 'string',
							title: 'Nombre del Proyecto',
							description:
								'Nombre del proyecto (sin espacios, usar kebab-case)',
						},
						domain: {
							type: 'string',
							title: 'Dominio del Proyecto',
							description:
								'Describe qué tipo de proyecto quieres crear',
						},
						tools: {
							type: 'string',
							title: 'Herramientas',
							description:
								'Lista las funcionalidades separadas por comas',
						},
					},
					required: ['project_name', 'domain', 'tools'],
				},
			}),
			// Timeout muy corto - si no responde en 2 segundos, usar fallback
			new Promise((_, reject) =>
				setTimeout(
					() =>
						reject(
							new Error('Elicitation timeout - UI not available')
						),
					2000
				)
			),
		]);

		const config = (projectResponse as any).content;
		logger.debug('Interactive mode config:', config);

		// Si llegamos aquí, la elicitación funcionó
		return {
			content: [
				{
					type: 'text' as const,
					text: `📋 **Modo Interactivo - Configuración Completada**

Has configurado tu proyecto MCP:

🎯 **Nombre**: ${config.project_name}
🎯 **Dominio**: ${config.domain}
🛠️ **Herramientas**: ${config.tools}

Ahora usa la función \`execute_create_project\` con estos parámetros:

- stack: "${stack}"
- project_name: "${config.project_name}"
- domain: "${config.domain}"
- tools: "${config.tools}"
- template_type: "basic"

Esto generará un prompt inteligente que incluye instrucciones para usar \`start_from_templates\` primero.`,
				},
			],
		};
	} catch (elicitError) {
		logger.warn(
			'Elicitation failed, switching to agent mode automatically:',
			elicitError
		);

		// Fallback automático: usar modo agent
		return await handleAgentMode(
			new PromptRegistry(env.PROMPTS_DIR),
			stack
		);
	}
}

async function handleQuickMode(server: McpServer, extra: any, stack: string) {
	logger.debug('Activating quick mode');

	// Elicitar información mínima usando extra.sendRequest
	const quickResponse = await extra.sendRequest(
		{
			method: 'elicitation/create',
			params: {
				message: 'Configuración rápida - Solo lo esencial:',
				requestedSchema: {
					type: 'object',
					properties: {
						project_name: {
							type: 'string',
							title: 'Nombre del Proyecto',
							description: 'Nombre del proyecto (sin espacios)',
						},
						domain: {
							type: 'string',
							title: 'Tipo de Proyecto',
							description: 'Describe brevemente tu proyecto',
						},
						tools: {
							type: 'string',
							title: 'Funcionalidades Básicas',
							description:
								'Lista las funciones principales separadas por comas',
						},
					},
					required: ['project_name', 'domain', 'tools'],
				},
			},
		},
		z.any()
	);

	const config = quickResponse.content as any;
	logger.debug('Quick mode config:', config);

	return {
		content: [
			{
				type: 'text' as const,
				text: `⚡ **Modo Rápido - Configuración Express**

Configuración completada:

🎯 **Nombre**: ${config.project_name}
🎯 **Proyecto**: ${config.domain}
⚡ **Funcionalidades**: ${config.tools}

Usa la función \`execute_create_project\` con estos parámetros:

- stack: "${stack}"
- project_name: "${config.project_name}"
- domain: "${config.domain}"
- tools: "${config.tools}"
- template_type: "basic"

Esto generará un prompt inteligente que incluye instrucciones para usar \`start_from_templates\` primero.`,
			},
		],
	};
}

function normalizeMode(mode: string): string {
	const normalized = mode.toLowerCase().trim();

	// Mapear variaciones comunes
	const modeMap: Record<string, string> = {
		agente: 'agent',
		agent: 'agent',
		asistente: 'agent',
		assistant: 'agent',
		interactivo: 'interactive',
		interactive: 'interactive',
		preguntas: 'interactive',
		rapido: 'quick',
		rápido: 'quick',
		quick: 'quick',
		fast: 'quick',
	};

	return modeMap[normalized] || 'interactive'; // Default fallback
}

function validateStack(stack: string): { isValid: boolean; message: string } {
	const normalizedStack = stack.toLowerCase().trim();
	const availableStacks = getAvailableStacks();
	const stackNames = availableStacks.map((s) => s.name.toLowerCase());

	if (stackNames.includes(normalizedStack)) {
		return { isValid: true, message: '' };
	}

	return {
		isValid: false,
		message: `❌ **Stack "${stack}" no disponible**

🚀 **Bootstrap Project MCP** actualmente solo soporta el stack **MCP**.

## 📚 Stacks Disponibles:

${availableStacks
	.map((s) => `- **${s.name.toUpperCase()}**: ${s.description} (${s.status})`)
	.join('\n')}

## 💡 Solución:

Usa \`create_project\` sin especificar stack (se configurará automáticamente a MCP) o especifica explícitamente:

\`\`\`
create_project({
  stack: "mcp",
  mode: "agent" // o "interactive" o "quick"
})
\`\`\`

## 🔮 Próximamente:

Los stacks **React**, **Astro**, **NestJS** y otros estarán disponibles en futuras versiones.

**¿Necesitas otro stack?** Tendrás que crearlo manualmente por ahora. Este MCP server se especializa en generación de proyectos MCP.`,
	};
}

function getAvailableStacks() {
	return [
		{
			name: 'mcp',
			status: '✅ Completamente funcional',
			description:
				'Model Context Protocol - Servidores MCP para Claude y otros agentes de IA',
			templates: ['basic-mcp', 'api-integration-mcp', 'http-mcp'],
			tools: 4,
		},
		// Futuros stacks (comentados hasta implementación)
		/*
		{
			name: 'react',
			status: '🔮 Próximamente',
			description: 'Aplicaciones React con TypeScript',
			templates: ['react-basic', 'react-vite', 'next-js'],
			tools: 0,
		},
		{
			name: 'astro',
			status: '🔮 Próximamente', 
			description: 'Sitios web estáticos y SSR con Astro',
			templates: ['astro-blog', 'astro-portfolio', 'astro-ecommerce'],
			tools: 0,
		},
		{
			name: 'nestjs',
			status: '🔮 Próximamente',
			description: 'APIs backend robustas con NestJS',
			templates: ['nestjs-rest', 'nestjs-graphql', 'nestjs-microservices'],
			tools: 0,
		},
		*/
	];
}
