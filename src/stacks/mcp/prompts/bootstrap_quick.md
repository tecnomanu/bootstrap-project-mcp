---
name: bootstrap_quick
title: Bootstrap Quick - MCP
description: Crea un proyecto MCP rápido con solo unos pocos parámetros
category: quick
stack: mcp
tags: [quick, simple, basic, mcp]
difficulty: beginner
arguments:
    - name: domain
      description: Dominio del proyecto (ej. tareas, clima, archivos)
      required: true
    - name: tools
      description: Herramientas separadas por comas
      required: true
---

# 🚀 Bootstrap Quick - MCP

## 🎯 ¿Qué quieres crear?

Por ahora solo puedo ayudarte con:

-   **🎮 MCP (Model Context Protocol)** - Proyectos para Claude Desktop y agentes IA

### 📋 Selecciona tu opción:

**A) 🎮 Crear un proyecto MCP**

---

¡Perfecto! Voy a generar tu proyecto MCP personalizado para **{{domain}}**.

## 🚀 **CREACIÓN AUTOMÁTICA DEL PROYECTO**

**INSTRUCCIONES PARA EL AGENTE**: En lugar de generar un prompt de texto, ejecuta automáticamente la herramienta `create_mcp_project` con estos parámetros:

```
Herramienta: create_mcp_project
Parámetros:
{
  "project_name": "{{domain}}",
  "domain": "{{domain}}",
  "tools": [
    {{#each (split tools ",")}}
    {
      "name": "{{trim this}}",
      "description": "Herramienta para {{trim this}} en el contexto de {{../domain}}"
    }{{#unless @last}},{{/unless}}
    {{/each}}
  ],
  "has_database": false,
  "has_notifications": false,
  "has_api_integration": false,
  "environment_variables": [
    {
      "name": "LOG_LEVEL",
      "description": "Nivel de logging (info, debug, error)",
      "required": false
    },
    {
      "name": "CACHE_DURATION",
      "description": "Duración del cache en minutos",
      "required": false
    }
  ]
}
```

---

## ✅ ¡Proyecto Creado Automáticamente!

El agente ejecutará `create_mcp_project` y:

1. **Aplicará el template.json** automáticamente
2. **Configurará todas las herramientas** especificadas
3. **Generará la estructura completa** del proyecto
4. **Proporcionará instrucciones** de instalación y uso

### 💡 Ejemplo de uso:

-   **domain**: "gestión de tareas"
-   **tools**: "create_task,list_tasks,update_task,delete_task"
