#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerBootstrapPrompts } from './prompts/index.js';
import { registerBootstrapTools } from './tools/index.js';
import { logger } from './utils/logger.js';

async function main() {
	try {
		const server = new McpServer({
			name: 'bootstrap-project-mcp',
			version: '1.0.0',
		});

		// Register tools
		registerBootstrapTools(server);

		// Register prompts
		registerBootstrapPrompts(server);

		// TODO: Register resources later
		// registerResources(server);

		const transport = new StdioServerTransport();
		await server.connect(transport);

		process.on('SIGINT', async () => {
			logger.info('Shutting down MCP Bootstrap...');
			process.exit(0);
		});
	} catch (error) {
		logger.error('ERROR: Failed to start server:', error);
		process.exit(1);
	}
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
	logger.error('FATAL: Uncaught exception:', error);
	process.exit(1);
});

process.on('unhandledRejection', (reason) => {
	logger.error('FATAL: Unhandled rejection:', reason);
	process.exit(1);
});

// Start the server
main().catch((error) => {
	logger.error('FATAL: Failed to start:', error);
	process.exit(1);
});
