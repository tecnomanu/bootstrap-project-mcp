import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { createProjectPrompt } from './create-project.js';

export function registerBootstrapPrompts(server: McpServer) {
	createProjectPrompt.forEach((prompt) => {
		server.registerPrompt(prompt.name, prompt.config, prompt.handler);
	});
}
