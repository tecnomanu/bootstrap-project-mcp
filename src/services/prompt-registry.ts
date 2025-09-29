import * as fs from 'fs';
import * as path from 'path';
import { logger } from '../utils/logger.js';

interface MCPPrompt {
	name: string;
	content: string;
}

export class PromptRegistry {
	private promptsDir: string;
	private prompts: Map<string, MCPPrompt> = new Map();

	constructor(promptsDir: string = './dist/stacks/mcp/prompts') {
		this.promptsDir = promptsDir;
		this.loadPrompts();
	}

	private loadPrompts(): void {
		try {
			if (!fs.existsSync(this.promptsDir)) {
				logger.warn(`Prompts directory not found: ${this.promptsDir}`);
				return;
			}

			const files = fs.readdirSync(this.promptsDir);
			const promptFiles = files.filter((file) => file.endsWith('.md'));

			for (const file of promptFiles) {
				try {
					const promptPath = path.join(this.promptsDir, file);
					const prompt = this.parsePromptFile(promptPath);
					if (prompt) {
						this.prompts.set(prompt.name, prompt);
					}
				} catch (error) {
					logger.error(`Error loading prompt ${file}:`, error);
				}
			}
		} catch (error) {
			logger.error('Error loading prompts:', error);
		}
	}

	private parsePromptFile(filePath: string): MCPPrompt | null {
		try {
			const content = fs.readFileSync(filePath, 'utf-8');
			const parts = content.split('---\n');

			if (parts.length < 3) {
				// Si no hay frontmatter YAML, usar todo el contenido
				return {
					name: path.basename(filePath, '.md'),
					content: content.trim(),
				};
			}

			const markdownContent = parts.slice(2).join('---\n').trim();

			return {
				name: path.basename(filePath, '.md'),
				content: markdownContent,
			};
		} catch (error) {
			logger.error(`Error parsing prompt file ${filePath}:`, error);
			return null;
		}
	}

	private getPrompt(name: string): MCPPrompt | undefined {
		return this.prompts.get(name);
	}

	generatePrompt(name: string, args: Record<string, string> = {}): string {
		const prompt = this.getPrompt(name);
		if (!prompt) {
			throw new Error(`Prompt '${name}' not found`);
		}

		let processedContent = prompt.content;

		// Reemplazar variables simples {{variable}}
		for (const [key, value] of Object.entries(args)) {
			const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
			processedContent = processedContent.replace(regex, value);
		}

		// Para el modo interactive, procesar las herramientas si existen
		if (name === 'bootstrap_interactive' && args.tools) {
			const toolsList = args.tools.split(',').map((tool) => tool.trim());
			let toolsSection = '';
			for (const tool of toolsList) {
				toolsSection += `- \`${tool}\`: Implementar funcionalidad para ${tool} en el contexto de ${
					args.domain || 'el proyecto'
				}\n`;
			}
			processedContent = processedContent.replace(
				/{{#each tools}}[\s\S]*?{{\/each}}/g,
				toolsSection
			);
		}

		// Procesar condicionales simples {{#if (ne variable "value")}}
		processedContent = this.processConditionals(processedContent, args);

		return processedContent;
	}

	private processConditionals(
		content: string,
		args: Record<string, string>
	): string {
		const conditionalRegex =
			/{{#if \(ne (\w+) "([^"]+)"\)}}([\s\S]*?){{\/if}}/g;

		return content.replace(
			conditionalRegex,
			(match, variable, value, innerContent) => {
				const argValue = args[variable];
				if (argValue && argValue !== value) {
					return innerContent;
				}
				return '';
			}
		);
	}
}
