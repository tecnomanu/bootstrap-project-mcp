import * as fs from 'fs';
import * as path from 'path';
import { logger } from '../utils/logger.js';

export interface ProjectTemplate {
	name: string;
	description: string;
	category: string;
	tags: string[];
	files: Record<string, string>;
}

export class TemplateService {
	private templatesDir: string;

	constructor(templatesDir: string = './dist/stacks/mcp/templates') {
		this.templatesDir = templatesDir;
	}

	/**
	 * Obtiene un template específico
	 */
	getTemplate(templateName: string): ProjectTemplate | null {
		try {
			const templatePath = path.join(
				this.templatesDir,
				templateName,
				'template.json'
			);

			if (!fs.existsSync(templatePath)) {
				logger.error(`Template not found: ${templatePath}`);
				return null;
			}

			const templateContent = fs.readFileSync(templatePath, 'utf-8');
			const template = JSON.parse(templateContent);

			return {
				name: template.name,
				description: template.description,
				category: template.category,
				tags: template.tags || [],
				files: template.files || {},
			};
		} catch (error) {
			logger.error(`Error loading template ${templateName}:`, error);
			return null;
		}
	}

	/**
	 * Lista todos los templates disponibles
	 */
	listTemplates(): string[] {
		try {
			if (!fs.existsSync(this.templatesDir)) {
				logger.warn(
					`Templates directory not found: ${this.templatesDir}`
				);
				return [];
			}

			return fs
				.readdirSync(this.templatesDir, { withFileTypes: true })
				.filter((dirent) => dirent.isDirectory())
				.map((dirent) => dirent.name);
		} catch (error) {
			logger.error('Error listing templates:', error);
			return [];
		}
	}

	/**
	 * Lista templates con información detallada
	 */
	listTemplatesWithInfo(): Array<{
		name: string;
		description: string;
		category: string;
		tags: string[];
	}> {
		try {
			const templates = this.listTemplates();
			return templates
				.map((templateName) => {
					const template = this.getTemplate(templateName);
					if (template) {
						return {
							name: template.name,
							description: template.description,
							category: template.category,
							tags: template.tags,
						};
					}
					return {
						name: templateName,
						description: 'Template sin descripción',
						category: 'unknown',
						tags: [],
					};
				})
				.filter(Boolean);
		} catch (error) {
			logger.error('Error listing templates with info:', error);
			return [];
		}
	}

	/**
	 * Selecciona el template apropiado basado en los requisitos
	 */
	selectTemplate(requirements: {
		hasApiIntegration?: boolean;
		hasHttpServer?: boolean;
		isBasic?: boolean;
	}): string {
		if (requirements.hasApiIntegration) {
			return 'api-integration-mcp';
		}

		if (requirements.hasHttpServer) {
			return 'http-mcp';
		}

		return 'basic-mcp'; // Default
	}

	/**
	 * Genera archivos del proyecto basado en un template
	 */
	generateProject(
		templateName: string,
		projectConfig: {
			projectName: string;
			kebabCaseName: string;
			domain: string;
			tools: string[];
		}
	): { success: boolean; files: Record<string, string>; error?: string } {
		try {
			const template = this.getTemplate(templateName);
			if (!template) {
				return {
					success: false,
					files: {},
					error: `Template '${templateName}' not found`,
				};
			}

			const generatedFiles: Record<string, string> = {};

			// Procesar cada archivo del template
			for (const [filePath, fileData] of Object.entries(template.files)) {
				// Extraer el contenido según el formato
				let content: string;
				if (typeof fileData === 'string') {
					// Formato legacy: contenido directo como string
					content = fileData;
				} else if (
					typeof fileData === 'object' &&
					fileData !== null &&
					'content' in fileData
				) {
					// Formato nuevo: objeto con content y description
					content = (fileData as any).content;
				} else {
					logger.warn(`Skipping file ${filePath}: invalid format`);
					continue;
				}

				const processedContent = this.processTemplateVariables(
					content,
					projectConfig
				);

				generatedFiles[filePath] = processedContent;
			}

			logger.info(
				`Generated ${
					Object.keys(generatedFiles).length
				} files from template '${templateName}'`
			);
			return { success: true, files: generatedFiles };
		} catch (error) {
			logger.error(
				`Error generating project from template '${templateName}':`,
				error
			);
			return {
				success: false,
				files: {},
				error: error instanceof Error ? error.message : String(error),
			};
		}
	}

	/**
	 * Procesa variables en el contenido del template
	 */
	private processTemplateVariables(
		content: string,
		config: {
			projectName: string;
			kebabCaseName: string;
			domain: string;
			tools: string[];
		}
	): string {
		let processed = content;

		// Variables básicas
		processed = processed.replace(
			/\{\{PROJECT_NAME\}\}/g,
			config.projectName
		);
		processed = processed.replace(
			/\{\{KEBAB_CASE_NAME\}\}/g,
			config.kebabCaseName
		);
		processed = processed.replace(/\{\{DOMAIN\}\}/g, config.domain);

		// Procesar herramientas si es necesario
		if (config.tools.length > 0) {
			const toolsSection = config.tools
				.map(
					(tool) =>
						`\t{\n\t\tname: '${tool}',\n\t\tdescription: 'Herramienta para ${tool}',\n\t\tinputSchema: {\n\t\t\ttype: 'object',\n\t\t\tproperties: {},\n\t\t},\n\t},`
				)
				.join('\n');

			// Si hay un placeholder para herramientas, reemplazarlo
			processed = processed.replace(
				/\{\{TOOLS_PLACEHOLDER\}\}/g,
				toolsSection
			);
		}

		// Escapar caracteres especiales para JSON
		processed = processed.replace(/\\n/g, '\n').replace(/\\t/g, '\t');

		return processed;
	}

	/**
	 * Convierte nombre del proyecto a kebab-case
	 */
	static toKebabCase(str: string): string {
		return str
			.toLowerCase()
			.replace(/[^a-z0-9]/g, '-')
			.replace(/-+/g, '-')
			.replace(/^-|-$/g, '');
	}
}
