# 🚀 Bootstrap Project MCP

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/bootstrap-project-mcp) [![Version](https://img.shields.io/badge/version-1.0.1-blue)](https://github.com/bootstrap-project-mcp) [![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE) [![MCP](https://img.shields.io/badge/MCP-Model%20Context%20Protocol-purple)](https://modelcontextprotocol.io) [![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org/) [![Node.js](https://img.shields.io/badge/Node.js-20+-green)](https://nodejs.org/)

🌍 **[Español](./README_es.md)** | **English**

**Bootstrap Project MCP** is a **MCP Server** for generating complete projects using templates and guided prompts. Supports multiple stacks: MCP, React, Astro, NestJS.

**🚀 STABLE VERSION** - Ready for production use! Currently supports MCP stack generation.

**How does it work?** Use the `create_project` tool that offers 3 interaction modes: **Agent** (conversational), **Interactive** (guided questions), and **Quick** (fast setup). The system automatically selects the perfect template and generates a complete, functional MCP project ready to use.

**What is MCP?** Model Context Protocol is an open standard that allows AI agents (like Claude) to connect with external tools and systems securely and in a standardized way.

## 🎯 What is Bootstrap Project MCP?

It's a **specialized MCP server** that works as a project creation tool and:

-   ✅ **Uses templates** as base skeletons for different technologies
-   ✅ **Guided conversational prompts** that adapt generation to the chosen stack
-   ✅ **Modular system by stacks** - MCP, React, Astro, NestJS organized by folders
-   ✅ **Generates complete projects** ready to use with one command
-   ✅ **Integrated best practices** as internal resources for each stack
-   ✅ **Expandable** - architecture prepared to add more stacks

## 🛠️ Supported Stacks

### 🎮 MCP (Model Context Protocol)

**Status**: ✅ Fully functional

-   **Available templates**: Basic MCP, API Integration MCP, HTTP MCP
-   **Interaction modes**: Agent (conversational), Interactive (guided), Quick (fast)
-   **Included resources**: Best Practices Guide, Template System
-   **MCP Tools**: 4 complete tools for project generation

### 🔮 Upcoming Stacks (Roadmap)

-   **⚛️ React** - Templates for React applications with TypeScript
-   **🚀 Astro** - Skeletons for static websites and SSR
-   **🏗️ NestJS** - Base templates for robust backend APIs
-   **⚡ Next.js** - Skeletons for full-stack applications
-   **📱 React Native** - Templates for mobile apps
-   **🎨 Tailwind** - Project skeletons with design

## 🛠️ Main Command

### 🚀 **`create_project`** - THE ONLY COMMAND YOU NEED!

This intelligent command handles the entire project creation flow:

1. **Select your stack** (currently only MCP)
2. **Choose your preferred interaction mode**
3. **The agent automatically detects** which template to use
4. **Creates the complete project** with ready-to-use files

### 🎯 **Available Interaction Modes:**

-   **🧙‍♂️ Agent Mode** - Natural conversation via chat, the agent asks questions and guides you through the process
-   **📋 Interactive Mode** - Step-by-step guided questions with form inputs (experimental, may fail in some environments)
-   **⚡ Quick Mode** - Fast setup with minimal questions, creates a complete MCP project quickly

### 🔧 **Additional Tools** (Internal agent use):

-   **`start_from_templates`**: Generates base files from templates
-   **`execute_create_project`**: Creates intelligent project prompts
-   **`list_templates`**: Lists available templates

## 🚀 Quick Installation

```bash
# Clone and install
cd bootstrap-project-mcp
pnpm install

# Build
pnpm run build

# Install globally
pnpm run install:global
```

## 🔧 Claude Desktop Configuration

Add to your `~/.config/mcp.json` or `~/Library/Application Support/Claude/mcp.json`:

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

## 🎯 How to Use - One Command

### 🚀 **Super Simple Usage:**

```bash
# In Claude Desktop - Just one command!
create_project
# The system will ask you to choose: agent, interactive, or quick mode
# Stack is automatically set to MCP (only supported stack currently)
```

**That's it!** The system will guide you step by step:

### 📋 **Automatic Flow:**

1. **Stack Selection**: Automatically set to MCP (only supported stack)
2. **Mode Selection**: The system asks which mode you prefer:

    - 🧙‍♂️ **"agent"** - Natural conversation via chat
    - 📋 **"interactive"** - Guided questions with form inputs
    - ⚡ **"quick"** - Fast setup with minimal questions

3. **Auto-Detection**: The agent automatically detects:

    - 🎯 Which template to use (basic-mcp, api-integration-mcp, http-mcp)
    - 🛠️ What tools you need
    - 🗄️ If you need a database
    - 🌐 If you need external APIs

4. **Project Creation**: The agent executes MCP tools and creates all files

### 💡 **Interaction Examples:**

```
User: create_project

Claude: 🚀 Welcome to the MCP Project Generator!
        How would you like to create your project?

        🧙‍♂️ Smart Assistant - "assistant"
        📋 Interactive Mode - "interactive"
        ⚡ Quick Mode - "quick"

User: agent

Claude: Perfect! Tell me what kind of project you need...
        [Natural conversation via chat that automatically detects everything]
```

## 🏗️ Architecture by Stacks

```
bootstrap-project-mcp/
├── src/
│   ├── index.ts              # Main MCP server
│   ├── tools/                # MCP tools (organized)
│   │   ├── index.ts          # Tools registry
│   │   ├── create-project.ts # Main creation tool
│   │   └── ...               # Individual tools
│   ├── services/             # Core services
│   │   ├── prompt-registry.ts # Prompt system
│   │   └── template-service.ts # Template system
│   └── utils/                # Utilities
├── stacks/                   # 🔥 MODULAR STRUCTURE BY STACK
│   ├── mcp/                  # MCP Stack
│   │   ├── resources/        # Best practices, documentation
│   │   ├── prompts/          # MCP-specific guided prompts
│   │   └── templates/        # MCP project templates/skeletons
│   ├── react/               # 🔮 Future: React Stack
│   ├── astro/               # 🔮 Future: Astro Stack
│   └── nestjs/              # 🔮 Future: NestJS Stack
└── dist/                    # Compiled code
```

## 🔄 Workflow with Templates

1. **Choose your stack**: Currently only MCP, more options coming soon
2. **Use guided prompts**: `create_project` (recommended)
3. **Answer the questions**: The agent selects and customizes templates
4. **Receive complete project**: Base skeleton + specific configuration
5. **Install and test**: `pnpm install && pnpm run inspector`

## 🎯 Generated Template Examples (MCP)

### 1. Task System MCP Template

```
Stack: MCP
Base template: Basic MCP + Database
Tools: create_task, list_tasks, update_task, delete_task
Domain: "task management system"
Integrations: SQLite, email notifications
```

### 2. Weather API MCP Template

```
Stack: MCP
Base template: API Integration MCP
Tools: get_weather, get_forecast, get_alerts
Domain: "weather information"
Integrations: OpenWeatherMap API, local cache
```

### 3. Data Analysis MCP Template

```
Stack: MCP
Base template: Basic MCP + Custom Tools
Tools: analyze_dataset, generate_report, create_visualization
Domain: "data analysis"
Integrations: Python scripts, databases
```

## 🧪 Testing

```bash
# Test with MCP Inspector (specific project)
pnpm run inspector

# Development live reload
pnpm run dev

# Validate build
pnpm run build
```

### 🔍 Using the Inspector

The `inspector` script lets you test any MCP tool:

```bash
# Example: use inspector with specific arguments
pnpm run inspector
```

## 🔮 Roadmap - Upcoming Stacks

### **⚛️ React Stack** (Coming Soon)

-   **Base templates**: Vite + React, Next.js, CRA
-   **Guided prompts**: `bootstrap_react_wizard`, `bootstrap_react_quick`
-   **Included resources**: React Best Practices, Component Library

### **🚀 Astro Stack** (Coming Soon)

-   **Base templates**: Blog, Portfolio, E-commerce
-   **Guided prompts**: `bootstrap_astro_wizard`, `bootstrap_astro_quick`
-   **Included resources**: Astro Best Practices, Integration Guide

### **🏗️ NestJS Stack** (Coming Soon)

-   **Base templates**: REST API, GraphQL, Microservices
-   **Guided prompts**: `bootstrap_nestjs_wizard`, `bootstrap_nestjs_quick`
-   **Included resources**: NestJS Best Practices, Architecture Guide

## 🤝 Contributing

Bootstrap Project MCP is an open source project. Contributions are welcome!

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

### How to Contribute:

1. **Add new stacks** - Create folder in `/stacks/` with templates and prompts
2. **Improve templates** - Optimize existing base skeletons
3. **Create guided prompts** - Improve conversational experience
4. **Documentation** - Guides and usage examples

### Development Setup:

```bash
# Fork the repository
git clone https://github.com/your-username/bootstrap-project-mcp.git
cd bootstrap-project-mcp

# Install dependencies
pnpm install

# Development mode
pnpm run dev

# Run tests
pnpm test

# Build
pnpm run build
```

## 🎯 Vision

**Bootstrap Project MCP** will be the definitive tool for generating projects of any technology using templates and AI-guided prompts.

**Today**: Templates and prompts for complete MCP projects  
**Tomorrow**: Skeletons for React, Astro, NestJS, and more  
**Future**: Templates for any stack you need

---

**🎯 Bootstrap Project MCP: MCP Server for generating projects using templates and guided prompts**

### 🚀 **Get Started Now!**

```bash
# In Claude Desktop - Just one command!
create_project
# Choose your mode: agent, interactive, or quick
```

**It's that simple!** The system will automatically guide you through the entire process.

**Your next project is just a conversation away!** 🎉

---

## 📄 License

MIT License - See [LICENSE](LICENSE) © 2024 Bootstrap Project MCP

## 🌟 Made with ❤️

Developed with ❤️ in Argentina for the global developer community.

---

## 🐛 Beta Feedback

This is a **BETA version**. We appreciate your feedback!

-   🐛 **Report bugs**: [GitHub Issues](https://github.com/bootstrap-project-mcp/issues)
-   💡 **Suggest features**: [GitHub Discussions](https://github.com/bootstrap-project-mcp/discussions)
-   📧 **Contact**: bootstrap-project-mcp@example.com

**Help us make it better!** 🚀
