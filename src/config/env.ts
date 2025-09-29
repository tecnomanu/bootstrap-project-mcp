import { config } from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
config();

// Get the directory of this module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Base directory is the dist folder of the package
const baseDir = dirname(__dirname); // Go up one level from config/ to dist/

export const env = {
	RESOURCES_DIR:
		process.env.RESOURCES_DIR || join(baseDir, 'stacks/mcp/resources'),
	TEMPLATES_DIR:
		process.env.TEMPLATES_DIR || join(baseDir, 'stacks/mcp/templates'),
	PROMPTS_DIR: process.env.PROMPTS_DIR || join(baseDir, 'stacks/mcp/prompts'),
	LOG_LEVEL: process.env.LOG_LEVEL || 'info',
};

// Debug: Log the resolved paths (only in development)
if (process.env.NODE_ENV !== 'production') {
	console.error('[DEBUG] Resolved paths:');
	console.error('[DEBUG] PROMPTS_DIR:', env.PROMPTS_DIR);
	console.error('[DEBUG] TEMPLATES_DIR:', env.TEMPLATES_DIR);
	console.error('[DEBUG] RESOURCES_DIR:', env.RESOURCES_DIR);
}
