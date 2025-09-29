import { config } from 'dotenv';

// Load environment variables
config();

export const env = {
	RESOURCES_DIR: process.env.RESOURCES_DIR || './dist/stacks/mcp/resources',
	TEMPLATES_DIR: process.env.TEMPLATES_DIR || './dist/stacks/mcp/templates',
	PROMPTS_DIR: process.env.PROMPTS_DIR || './dist/stacks/mcp/prompts',
	LOG_LEVEL: process.env.LOG_LEVEL || 'info',
};
