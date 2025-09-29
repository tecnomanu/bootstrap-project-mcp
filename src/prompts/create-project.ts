import { z } from 'zod';

export const createProjectPrompt = [
	{
		name: 'generate_prompt_project',
		config: {
			title: '🚀 Generador de Proyectos MCP',
			description:
				'Inicia el flujo completo de creación de proyectos con asistente inteligente',
			argsSchema: {
				stack: z
					.enum(['mcp'])
					.describe('Stack del proyecto (solo MCP disponible)'),
				mode: z
					.enum(['agent', 'interactive', 'quick'])
					.describe(
						'Modo de creación: agent (conversacional), interactive (formularios), quick (rápido)'
					),
			},
		},
		handler: ({
			stack = 'mcp',
			mode = 'interactive',
		}: {
			stack: 'mcp';
			mode: 'agent' | 'interactive' | 'quick';
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
