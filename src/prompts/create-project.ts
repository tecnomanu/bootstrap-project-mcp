import { z } from 'zod';

export const createProjectPrompt = [
	{
		name: 'generate_prompt_project',
		config: {
			title: '🚀 Generador de Proyectos MCP',
			description:
				'Inicia el flujo completo de creación de proyectos con asistente inteligente',
			argsSchema: {
				stack: z.string(),
				mode: z.string(),
			},
		},
		handler: ({
			stack = 'mcp',
			mode = 'interactive',
		}: {
			stack: string;
			mode: string;
		}) => ({
			messages: [
				{
					role: 'user' as const,
					content: {
						type: 'text' as const,
						text: `Crea un proyecto ${stack.toUpperCase()} en modo ${mode}. Utiliza la función create_project con stack="${stack}" y mode="${mode}" para comenzar el proceso de creación.`,
					},
				},
			],
		}),
	},
];
