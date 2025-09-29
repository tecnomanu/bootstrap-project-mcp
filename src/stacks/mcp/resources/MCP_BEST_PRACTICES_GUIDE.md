# 🛡️ MCP Best Practices Guide - Technical Reference Document

## 📖 About This Document

This document contains all best practices, architectural patterns, and technical configurations necessary to create professional, production-ready MCP (Model Context Protocol) projects.

**⚠️ Important**: This is a technical reference document. Use it together with `MCP_PROMPT_STARTER.md` to generate complete MCP projects.

**🌐 Language Note**: While all code, functions, files, and documentation are in English, user-facing messages should be in the client's preferred language to provide the best user experience.

---

## 🏗️ MANDATORY MCP ARCHITECTURE

### Required Transport Layers:

-   **STDIO Transport**: For Claude Desktop (local connection)
-   **HTTP/SSE Transport**: For remote connections and APIs
-   **Single codebase** that handles both transports automatically

### Mandatory Technology Stack:

-   **TypeScript** (NOT JavaScript) - Strong typing mandatory
-   **Node.js** with ESM modules (import/export)
-   **Express** for HTTP server
-   **MCP SDK** latest version (1.x+)
-   **Build system** that generates `dist/` with compiled code

---

## 🛠️ MANDATORY CORE FUNCTIONALITIES

### MCP Protocol Implementation:

**🌐 Note**: All code should be in English, but error messages and user-facing content should adapt to the client's language when possible.

```typescript
// Tool discovery - OBLIGATORIO
server.setRequestHandler(ListToolsRequestSchema, async () => ({
	tools: MCP_TOOLS,
}));

// Tool execution - OBLIGATORIO
server.setRequestHandler(CallToolRequestSchema, async (request) => {
	const { name, arguments: args } = request.params;
	// Implementación de cada herramienta...
});
```

### Error Handling Robusto:

```typescript
try {
	// Lógica de herramienta
} catch (error) {
	console.error(`Error in tool ${name}:`, error);
	throw new McpError(
		ErrorCode.InternalError,
		`Error ejecutando tool '${name}': ${error.message}`
	);
}
```

### Logging Detallado:

```typescript
const log = (...args) => console.error('[project-name]', ...args);
log('STDIO mode ready for Claude Desktop');
log('HTTP/SSE mode ready on port', port);
```

---

## 🔄 ELICITATION PATTERNS (ADVANCED - OPTIONAL)

### When to Use Elicitations:

Elicitations allow MCP servers to request input from users through UI forms. **Use sparingly and always with fallbacks**.

### ⚠️ Important Elicitation Guidelines:

1. **Always implement fallback patterns** - elicitations may not work in all environments
2. **Don't use elicitations by default** - they require specific UI support
3. **Provide alternative flows** when elicitations fail
4. **Test in multiple environments** (Claude Desktop, Cursor, etc.)

### Elicitation Pattern with Fallback:

```typescript
async function handleInteractiveMode(server: McpServer) {
	try {
		// Try elicitation with short timeout
		const response = await Promise.race([
			server.server.elicitInput({
				message: 'Configure your project:',
				requestedSchema: {
					type: 'object',
					properties: {
						project_name: { type: 'string', title: 'Project Name' },
						domain: { type: 'string', title: 'Domain' },
					},
					required: ['project_name', 'domain'],
				},
			}),
			// Timeout after 2 seconds
			new Promise((_, reject) =>
				setTimeout(() => reject(new Error('Elicitation timeout')), 2000)
			),
		]);

		const config = (response as any).content;
		return handleSuccessfulElicitation(config);
	} catch (error) {
		// Fallback: provide clear instructions
		return {
			content: [
				{
					type: 'text',
					text: `⚠️ Interactive input not available. Please provide parameters manually:
        
Use the tool with these parameters:
- project_name: "your-project-name"
- domain: "your project description"`,
				},
			],
		};
	}
}
```

### Alternative Elicitation Pattern (extra.sendRequest):

```typescript
// This pattern might work in some environments
async function alternativeElicitationPattern(extra: any) {
	try {
		const response = await extra.sendRequest(
			{
				method: 'elicitation/create',
				params: {
					message: 'Configure options:',
					requestedSchema: {
						/* schema */
					},
				},
			},
			z.any()
		);

		return handleResponse(response.content);
	} catch (error) {
		return fallbackResponse();
	}
}
```

---

## 🔐 MANDATORY AUTHENTICATION

### Bearer Token Support:

```typescript
function isAuthorized(req) {
	const expected = process.env.MCP_BEARER;
	if (!expected) return true; // Modo abierto

	// Múltiples formatos de headers
	let token = '';
	if (req.headers.authorization?.startsWith('Bearer ')) {
		token = req.headers.authorization.slice(7);
	} else if (req.headers.bearer) {
		token = req.headers.bearer;
	} else if (req.headers.authorization) {
		token = req.headers.authorization;
	}

	return token === expected;
}
```

### Variables de Entorno de Seguridad:

-   `MCP_BEARER`: Token de autenticación (opcional)
-   `ALLOWED_ORIGINS`: CORS origins permitidos
-   `MCP_BODY_LIMIT`: Límite de tamaño de requests

---

## 📂 ESTRUCTURA DE PROYECTO OBLIGATORIA

```
mi-proyecto-mcp/
├── src/
│   ├── index.ts              # Entry point con transport selection
│   ├── http-server.ts        # HTTP/SSE server implementation
│   ├── mcp-tools.ts          # Tool definitions (schema)
│   ├── services/
│   │   └── business-service.ts # Lógica de negocio
│   └── utils/
│       └── helpers.ts        # Utilidades
├── dist/                     # Compiled TypeScript
├── docs/                     # Documentation
├── .env.example              # Environment variables template
├── mcp.json                  # Claude Desktop config
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript config
├── Dockerfile                # Container config (opcional)
├── LICENSE                   # MIT License
└── README.md                 # Complete documentation
```

---

## 📋 PACKAGE.JSON OBLIGATORIO

### Scripts Mínimos Requeridos:

```json
{
	"name": "mi-proyecto-mcp",
	"version": "1.0.0",
	"type": "module",
	"main": "dist/index.js",
	"bin": {
		"mi-proyecto": "./dist/index.js"
	},
	"files": ["dist", "src"],
	"scripts": {
		"dev": "tsx watch src/index.ts",
		"dev:http": "MCP_TRANSPORT=http tsx watch src/index.ts",
		"build": "tsc && npm pack",
		"start": "node dist/index.js",
		"start:http": "MCP_TRANSPORT=http node dist/index.js",
		"install:global": "npm run build && npm install -g ./*.tgz",
		"inspector": "npx @modelcontextprotocol/inspector npx mi-proyecto",
		"lint": "eslint src --ext .ts",
		"test": "jest"
	},
	"dependencies": {
		"@modelcontextprotocol/sdk": "^1.0.1",
		"express": "^4.19.2",
		"dotenv": "^16.3.1"
	},
	"devDependencies": {
		"@types/node": "^20.0.0",
		"@types/express": "^4.17.0",
		"tsx": "^4.0.0",
		"typescript": "^5.0.0",
		"eslint": "^8.0.0",
		"@typescript-eslint/eslint-plugin": "^6.0.0",
		"@typescript-eslint/parser": "^6.0.0"
	},
	"keywords": [
		"mcp",
		"model-context-protocol",
		"claude",
		"ai",
		"typescript",
		"nodejs"
	],
	"author": "Tu Nombre",
	"license": "MIT"
}
```

---

## 🔧 CONFIGURACIÓN TYPESCRIPT OBLIGATORIA

### tsconfig.json:

```json
{
	"compilerOptions": {
		"target": "ES2022",
		"module": "ESNext",
		"moduleResolution": "node",
		"esModuleInterop": true,
		"allowSyntheticDefaultImports": true,
		"strict": true,
		"declaration": true,
		"declarationMap": true,
		"sourceMap": true,
		"outDir": "./dist",
		"rootDir": "./src",
		"resolveJsonModule": true,
		"skipLibCheck": true,
		"forceConsistentCasingInFileNames": true
	},
	"include": ["src/**/*"],
	"exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

---

## 🌐 HTTP/SSE TRANSPORT PATTERN

### Entry Point Pattern:

```typescript
#!/usr/bin/env node
import { config } from 'dotenv';
config();

const mode = (process.env.MCP_TRANSPORT || 'stdio').toLowerCase();

if (mode === 'http') {
	await startHttpServer(registerTools, {
		port: Number(process.env.MCP_PORT || process.env.PORT || 3000),
	});
	log('HTTP/SSE mode ready');
	process.stdin.pause();
	return;
}

// Default: STDIO transport
const server = new Server({ name: 'mi-proyecto', version: pkg.version });
registerTools(server);
await server.connect(new StdioServerTransport());
log('STDIO mode ready for Claude Desktop');
```

### HTTP Server Pattern:

```typescript
export async function startHttpServer(registerTools, opts = {}) {
	const app = express();
	app.use(express.json({ limit: process.env.MCP_BODY_LIMIT ?? '1mb' }));

	const server = new Server({ name: 'mi-proyecto', version: pkg.version });
	registerTools(server);

	const transports = new Map<string, SSEServerTransport>();
	const POST_ENDPOINT = '/messages';

	// POST endpoint para mensajes JSON-RPC
	app.post(POST_ENDPOINT, async (req, res) => {
		if (!isAuthorized(req)) return res.status(401).end();
		// Lógica de manejo de mensajes...
	});

	// SSE endpoint para establecer conexión
	app.get('/sse', async (req, res) => {
		if (!isAuthorized(req)) return res.status(401).end();
		// Configuración SSE...
		const transport = new SSEServerTransport(POST_ENDPOINT, res);
		await server.connect(transport);
	});

	// Health check - OBLIGATORIO
	app.get('/health', (req, res) => {
		res.json({ ok: true, transport: 'http', version: pkg.version });
	});

	const port = Number(opts?.port ?? 3000);
	app.listen(port, () => {
		console.error(`[mcp:http] listening http://localhost:${port}/sse`);
	});
}
```

---

## 🔧 VARIABLES DE ENTORNO ESTÁNDAR

### .env.example Obligatorio:

```bash
# === CONFIGURACIÓN PRINCIPAL ===
# Transporte: 'http' para servidor HTTP, 'stdio' para STDIO
MCP_TRANSPORT=stdio

# Puerto donde se expondrá el servidor HTTP (solo aplica si MCP_TRANSPORT=http)
MCP_PORT=3000
PORT=3000

# === AUTENTICACIÓN ===
# Token Bearer para autenticación (opcional - si no se define, modo abierto)
MCP_BEARER=mi-token-secreto-2024

# === CORS ===
# Orígenes permitidos para CORS (separados por coma)
ALLOWED_ORIGINS=*

# === CONFIGURACIÓN TÉCNICA ===
# Límite de tamaño del body de requests
MCP_BODY_LIMIT=1mb

# Nivel de logging
LOG_LEVEL=info
```

---

## 📖 DOCUMENTACIÓN OBLIGATORIA

### README.md Sections:

1. **Badges** - Version, MCP, License, etc.
2. **Banner/Logo** - Visual identity
3. **Descripción** - Qué hace el proyecto
4. **Instalación** - `pnpm install`
5. **Uso** - STDIO y HTTP modes
6. **Configuración Claude Desktop** - mcp.json
7. **Testing** - MCP Inspector
8. **API Reference** - Herramientas disponibles
9. **Build y Deploy** - Scripts de package.json
10. **Licencia** - MIT

### Claude Desktop Config (mcp.json):

```json
{
	"mcpServers": {
		"mi-proyecto": {
			"command": "npx",
			"args": ["mi-proyecto"],
			"env": {
				"MCP_TRANSPORT": "stdio"
			}
		}
	}
}
```

---

## ✅ TESTING OBLIGATORIO

### MCP Inspector Support:

```bash
# Opción 1: Usar script npm/pnpm (Recomendado)
npm run inspector
# o con pnpm:
pnpm run inspector

# Opción 2: Manual
npx @modelcontextprotocol/inspector npx mi-proyecto

# Test HTTP transport
MCP_TRANSPORT=http npm start
# En otra terminal:
curl http://localhost:3000/health
```

### Manual Testing:

```bash
# Test tool discovery
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}' | node dist/index.js

# Test tool execution
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": "mi_tool", "arguments": {}}}' | node dist/index.js
```

---

## 🚀 BUILD Y DEPLOY OBLIGATORIO

### Build Process:

```bash
# Instalar pnpm globalmente
npm install -g pnpm

# Desarrollo
pnpm run dev          # STDIO mode
pnpm run dev:http     # HTTP mode

# Testing
pnpm run inspector    # MCP Inspector (Recomendado)

# Producción
pnpm run build        # Compile TypeScript
pnpm run start        # Run compiled
pnpm run start:http   # Run compiled HTTP

# Global install
pnpm run install:global
npx mi-proyecto       # Ejecutar globalmente
```

### Docker Support (Opcional):

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist/ ./dist/
EXPOSE 3000
ENV MCP_TRANSPORT=http
CMD ["node", "dist/index.js"]
```

---

## 🛡️ SECURITY BEST PRACTICES

### Input Validation:

```typescript
if (!args || typeof args !== 'object') {
	throw new McpError(ErrorCode.InvalidParams, 'Invalid arguments');
}
```

### Rate Limiting (HTTP):

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // limit each IP to 100 requests per windowMs
});

app.use(limiter);
```

### CORS Configuration:

```typescript
function isAllowedOrigin(req) {
	const list = (process.env.ALLOWED_ORIGINS || '*')
		.split(',')
		.map((s) => s.trim());
	if (list.includes('*')) return true;
	const origin = String(req.headers.origin || '');
	return list.includes(origin);
}
```

---

## 📊 MONITORING Y OBSERVABILITY

### Health Checks:

```typescript
app.get('/health', (req, res) => {
	res.json({
		ok: true,
		transport: 'http',
		version: pkg.version,
		uptime: process.uptime(),
		memory: process.memoryUsage(),
		sessions: transports.size,
	});
});
```

### Structured Logging:

```typescript
const log = {
	info: (...args) =>
		console.log(JSON.stringify({ level: 'info', message: args })),
	error: (...args) =>
		console.error(JSON.stringify({ level: 'error', message: args })),
	debug: (...args) =>
		console.debug(JSON.stringify({ level: 'debug', message: args })),
};
```

---

## 🎯 CRITERIOS DE ÉXITO OBLIGATORIOS

-   ✅ **Funciona con Claude Desktop** (STDIO transport)
-   ✅ **Funciona con MCP Inspector** (HTTP transport)
-   ✅ **Build genera dist/ funcional** (`npm run build`)
-   ✅ **npx ejecuta correctamente** (global install)
-   ✅ **Autenticación configurable** (Bearer token)
-   ✅ **Logs informativos** (structured logging)
-   ✅ **Documentación completa** (README + docs/)
-   ✅ **Código TypeScript limpio** (tipado fuerte)
-   ✅ **Health checks funcionando** (/health endpoint)
-   ✅ **Error handling robusto** (McpError)

---

## 📚 REFERENCIAS TÉCNICAS

-   [MCP Specification](https://modelcontextprotocol.io/docs)
-   [MCP SDK TypeScript](https://github.com/modelcontextprotocol/typescript-sdk)
-   [TypeScript Best Practices](https://typescript-eslint.io/)
-   [Node.js ESM Guide](https://nodejs.org/api/esm.html)
-   [Express.js Documentation](https://expressjs.com/)

---

**🎯 Este documento define los estándares mínimos para proyectos MCP profesionales. Todos los elementos marcados como "OBLIGATORIO" deben implementarse sin excepción.**
