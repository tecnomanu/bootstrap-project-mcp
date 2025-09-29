import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerProjectGenerationTools } from './create-project.js';

export function registerBootstrapTools(server: McpServer) {
	registerProjectGenerationTools(server);
}
