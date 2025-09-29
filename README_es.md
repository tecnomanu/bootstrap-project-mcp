# 🚀 Bootstrap Project MCP

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/bootstrap-project-mcp) [![Version](https://img.shields.io/badge/version-1.0.0--beta-orange)](https://github.com/bootstrap-project-mcp) [![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE) [![MCP](https://img.shields.io/badge/MCP-Model%20Context%20Protocol-purple)](https://modelcontextprotocol.io) [![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org/) [![Node.js](https://img.shields.io/badge/Node.js-20+-green)](https://nodejs.org/)

**Español** | 🌍 **[English](./README.md)**

**Bootstrap Project MCP** es un **MCP Server** para generar proyectos completos usando templates y prompts guiados. Soporta múltiples stacks: MCP, React, Astro, NestJS.

**🚧 VERSIÓN BETA** - Esta es una versión beta. Algunas funcionalidades pueden ser experimentales. ¡Por favor reporta problemas y comparte tu feedback!

**¿Cómo funciona?** Usa comandos simples en tu IDE como `/bootstrap_wizard` que activan prompts conversacionales inteligentes. El agente te hace preguntas específicas, selecciona el template perfecto para tu proyecto, y en segundos tienes un proyecto completo y funcional listo para usar.

**¿Qué es MCP?** Model Context Protocol es un estándar abierto que permite a los agentes de IA (como Claude) conectarse con herramientas externas y sistemas de forma segura y estandarizada.

## 🎯 ¿Qué es Bootstrap Project MCP?

Es un **servidor MCP especializado** que funciona como una herramienta para crear proyectos y que:

-   ✅ **Utiliza templates** como esqueletos base para diferentes tecnologías
-   ✅ **Prompts guiados** conversacionales que adaptan la generación al stack elegido
-   ✅ **Sistema modular por stacks** - MCP, React, Astro, NestJS organizados por carpetas
-   ✅ **Genera proyectos completos** listos para usar con un comando
-   ✅ **Mejores prácticas integradas** como recursos internos por cada stack
-   ✅ **Expansible** - arquitectura preparada para agregar más stacks

## 🛠️ Stacks Soportados

### 🎮 MCP (Model Context Protocol)

**Estado**: ✅ Completamente funcional

-   **Templates disponibles**: Basic MCP, API Integration MCP, HTTP MCP
-   **Prompts guiados**: `bootstrap_wizard`, `bootstrap_assistant`, `bootstrap_interactive`, `bootstrap_quick`
-   **Recursos incluidos**: Guía de Mejores Prácticas, Prompt Starter
-   **Herramientas MCP**: 4 herramientas completas para generación de proyectos

### 🔮 Próximos Stacks (Roadmap)

-   **⚛️ React** - Templates para aplicaciones React con TypeScript
-   **🚀 Astro** - Esqueletos para sitios web estáticos y SSR
-   **🏗️ NestJS** - Templates base para APIs backend robustas
-   **⚡ Next.js** - Esqueletos para aplicaciones full-stack
-   **📱 React Native** - Templates para apps móviles
-   **🎨 Tailwind** - Esqueletos de proyectos con diseño

## 🛠️ Comando Principal

### 🚀 **`create_project`** - ¡EL ÚNICO COMANDO QUE NECESITAS!

Este comando inteligente maneja todo el flujo de creación de proyectos:

1. **Selecciona tu stack** (actualmente solo MCP)
2. **Elige tu modo preferido** de interacción
3. **El agente detecta automáticamente** qué template usar
4. **Crea el proyecto completo** con archivos listos para usar

### 🎯 **Modos de Interacción Disponibles:**

-   **🧙‍♂️ Asistente Inteligente** - Conversación natural y automática
-   **📋 Modo Interactivo** - Preguntas paso a paso con control total
-   **⚡ Modo Rápido** - Proyecto funcional en segundos

### 🔧 **Herramientas Adicionales** (Uso interno del agente):

-   **`start_from_templates`**: Genera archivos base desde templates
-   **`execute_create_project`**: Crea prompts inteligentes de proyecto
-   **`list_templates`**: Lista templates disponibles

## 🚀 Instalación Rápida

```bash
# Clonar e instalar
cd bootstrap-project-mcp
pnpm install

# Compilar
pnpm run build

# Instalar globalmente
pnpm run install:global
```

## 🔧 Configuración Claude Desktop

Agregar a tu `~/.config/mcp.json` o `~/Library/Application Support/Claude/mcp.json`:

```json
{
	"mcpServers": {
		"bootstrap-project-mcp": {
			"command": "npx",
			"args": ["bootstrap-project-mcp"],
			"env": {
				"MCP_TRANSPORT": "stdio"
			}
		}
	}
}
```

## 🎯 Cómo Usar - Un Solo Comando

### 🚀 **Uso Súper Simple:**

```bash
# En Claude Desktop - ¡Solo un comando!
create_project
```

**¡Eso es todo!** El sistema te guiará paso a paso:

### 📋 **Flujo Automático:**

1. **Selección de Stack**: Elige tu stack (actualmente MCP)
2. **Selección de Modo**: El agente te pregunta qué modo prefieres:

    - 🧙‍♂️ **"asistente"** - Conversación natural
    - 📋 **"interactivo"** - Preguntas específicas
    - ⚡ **"rápido"** - Template básico instantáneo

3. **Auto-Detección**: El agente detecta automáticamente:

    - 🎯 Qué template usar (basic-mcp, api-integration-mcp, http-mcp)
    - 🛠️ Qué herramientas necesitas
    - 🗄️ Si necesitas base de datos
    - 🌐 Si necesitas APIs externas

4. **Creación del Proyecto**: El agente ejecuta las herramientas MCP y crea todos los archivos

### 💡 **Ejemplos de Interacción:**

```
Usuario: create_project

Claude: 🚀 ¡Bienvenido al Generador de Proyectos MCP!
        ¿Cómo te gustaría crear tu proyecto?

        🧙‍♂️ Asistente Inteligente - "asistente"
        📋 Modo Interactivo - "interactivo"
        ⚡ Modo Rápido - "rápido"

Usuario: asistente

Claude: ¡Perfecto! Cuéntame qué tipo de proyecto necesitas...
        [Conversación natural que detecta automáticamente todo]
```

## 🏗️ Arquitectura por Stacks

```
bootstrap-project-mcp/
├── src/
│   ├── index.ts              # Servidor MCP principal
│   ├── tools/                # Herramientas MCP (organizadas)
│   │   ├── index.ts          # Registro de herramientas
│   │   ├── create-project.ts # Herramienta principal de creación
│   │   └── ...               # Herramientas individuales
│   ├── services/             # Servicios principales
│   │   ├── prompt-registry.ts # Sistema de prompts
│   │   └── template-service.ts # Sistema de templates
│   └── utils/                # Utilidades
├── stacks/                   # 🔥 ESTRUCTURA MODULAR POR STACK
│   ├── mcp/                  # Stack MCP
│   │   ├── resources/        # Mejores prácticas, documentación
│   │   ├── prompts/          # Prompts guiados específicos de MCP
│   │   └── templates/        # Templates/esqueletos de proyectos MCP
│   ├── react/               # 🔮 Futuro: Stack React
│   ├── astro/               # 🔮 Futuro: Stack Astro
│   └── nestjs/              # 🔮 Futuro: Stack NestJS
└── dist/                    # Código compilado
```

## 🔄 Flujo de Trabajo con Templates

1. **Elige tu stack**: Por ahora solo MCP, pronto más opciones
2. **Usa prompts guiados**: `create_project` (recomendado)
3. **Responde las preguntas**: El agente selecciona y personaliza templates
4. **Recibe proyecto completo**: Esqueleto base + configuración específica
5. **Instala y prueba**: `pnpm install && pnpm run inspector`

## 🎯 Ejemplos de Templates Generados (MCP)

### 1. Template MCP de Sistema de Tareas

```
Stack: MCP
Template base: Basic MCP + Database
Herramientas: create_task, list_tasks, update_task, delete_task
Dominio: "sistema de gestión de tareas"
Integraciones: SQLite, notificaciones email
```

### 2. Template MCP de API de Clima

```
Stack: MCP
Template base: API Integration MCP
Herramientas: get_weather, get_forecast, get_alerts
Dominio: "información meteorológica"
Integraciones: OpenWeatherMap API, cache local
```

### 3. Template MCP de Análisis de Datos

```
Stack: MCP
Template base: Basic MCP + Custom Tools
Herramientas: analyze_dataset, generate_report, create_visualization
Dominio: "análisis de datos"
Integraciones: Python scripts, bases de datos
```

## 🧪 Testing

```bash
# Probar con MCP Inspector (proyecto específico)
pnpm run inspector

# Desarrollo en vivo
pnpm run dev

# Validar build
pnpm run build
```

### 🔍 Usando el Inspector

El script `inspector` te permite probar cualquier herramienta MCP:

```bash
# Ejemplo: usar inspector con argumentos específicos
pnpm run inspector
```

## 🔮 Roadmap - Próximos Stacks

### **⚛️ React Stack** (Próximamente)

-   **Templates base**: Vite + React, Next.js, CRA
-   **Prompts guiados**: `bootstrap_react_wizard`, `bootstrap_react_quick`
-   **Recursos incluidos**: React Best Practices, Component Library

### **🚀 Astro Stack** (Próximamente)

-   **Templates base**: Blog, Portfolio, E-commerce
-   **Prompts guiados**: `bootstrap_astro_wizard`, `bootstrap_astro_quick`
-   **Recursos incluidos**: Astro Best Practices, Integration Guide

### **🏗️ NestJS Stack** (Próximamente)

-   **Templates base**: REST API, GraphQL, Microservices
-   **Prompts guiados**: `bootstrap_nestjs_wizard`, `bootstrap_nestjs_quick`
-   **Recursos incluidos**: NestJS Best Practices, Architecture Guide

## 🤝 Contribuir

Bootstrap Project MCP es un proyecto open source. ¡Las contribuciones son bienvenidas!

Por favor lee nuestro [Código de Conducta](CODE_OF_CONDUCT.md) antes de contribuir.

### Cómo Contribuir:

1. **Agregar nuevos stacks** - Crea carpeta en `/stacks/` con templates y prompts
2. **Mejorar templates** - Optimiza esqueletos base existentes
3. **Crear prompts guiados** - Mejora la experiencia conversacional
4. **Documentación** - Guías y ejemplos de uso

### Configuración de Desarrollo:

```bash
# Haz fork del repositorio
git clone https://github.com/tu-usuario/bootstrap-project-mcp.git
cd bootstrap-project-mcp

# Instalar dependencias
pnpm install

# Modo desarrollo
pnpm run dev

# Ejecutar tests
pnpm test

# Compilar
pnpm run build
```

## 🎯 Visión

**Bootstrap Project MCP** será la herramienta definitiva para generar proyectos de cualquier tecnología usando templates y prompts guiados con IA.

**Hoy**: Templates y prompts para proyectos MCP completos  
**Mañana**: Esqueletos para React, Astro, NestJS, y más  
**Futuro**: Templates para cualquier stack que necesites

---

**🎯 Bootstrap Project MCP: MCP Server para generar proyectos usando templates y prompts guiados**

### 🚀 **¡Empieza Ahora!**

```bash
# En Claude Desktop - ¡Solo un comando!
create_project
```

**¡Así de simple!** El sistema te guiará automáticamente por todo el proceso.

**¡Tu próximo proyecto está a una conversación de distancia!** 🎉

---

## 📄 Licencia

MIT License - Ver [LICENSE](LICENSE) © 2024 Bootstrap Project MCP

## 🌟 Hecho con ❤️

Desarrollado con ❤️ en Argentina para la comunidad global de desarrolladores.

---

## 🐛 Feedback Beta

Esta es una **versión BETA**. ¡Apreciamos tu feedback!

-   🐛 **Reportar bugs**: [GitHub Issues](https://github.com/bootstrap-project-mcp/issues)
-   💡 **Sugerir funcionalidades**: [GitHub Discussions](https://github.com/bootstrap-project-mcp/discussions)
-   📧 **Contacto**: bootstrap-project-mcp@example.com

**¡Ayúdanos a mejorarlo!** 🚀

