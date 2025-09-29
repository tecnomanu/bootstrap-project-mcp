---
name: bootstrap_interactive
title: Bootstrap Interactive - MCP
description: Te ayudo a crear un prompt personalizado para generar proyectos MCP completos
category: interactive
stack: mcp
tags: [interactive, generator, guided, mcp]
difficulty: beginner
arguments:
    - name: domain
      description: Dominio específico del proyecto MCP (ej. gestión de tareas, sistema meteorológico)
      required: true
    - name: tools
      description: Lista de herramientas separadas por comas (ej. create_task,list_tasks,update_task)
      required: true
    - name: database
      description: Tipo de base de datos (none,sqlite,postgresql,mysql,mongodb)
      required: false
      default: 'sqlite'
    - name: transport
      description: Modo de transporte (stdio,http,both)
      required: false
      default: 'stdio'
    - name: notifications
      description: Tipos de notificaciones separadas por comas (none,email,telegram,slack,sms)
      required: false
      default: 'none'
    - name: api_integrations
      description: Integraciones de APIs externas (ej. OpenWeatherMap,OpenAI,Stripe)
      required: false
      default: 'none'
---

# 🚀 Bootstrap Interactive - MCP

## 🎯 ¿Qué quieres crear?

Por ahora solo puedo ayudarte con:

-   **🎮 MCP (Model Context Protocol)** - Proyectos para Claude Desktop y agentes IA

### 📋 Selecciona tu opción:

**A) 🎮 Crear un proyecto MCP**

---

**Dominio:** {{domain}}

Basándome en tu configuración, aquí está tu prompt personalizado:

---

## 🎯 PROMPT COMPLETO PARA CREAR TU MCP:

```
Necesito crear un proyecto MCP (Model Context Protocol) completo y profesional para {{domain}}.

## 🎯 HERRAMIENTAS MCP REQUERIDAS:

{{#each tools}}
- `{{this}}`: Implementar funcionalidad para {{this}} en el contexto de {{../domain}}
{{/each}}

## 🔧 CONFIGURACIÓN ESPECÍFICA:

### Modo de Transporte:
- Configuración: {{transport}}
- STDIO para Claude Desktop{{#if (ne transport "stdio")}} + HTTP/SSE para acceso remoto{{/if}}

### Base de Datos:
- Tipo: {{database}}
{{#if (ne database "none")}}
- Configurar conexión y modelos de datos para {{database}}
{{else}}
- Sin persistencia de datos (solo procesamiento en memoria)
{{/if}}

### Variables de Entorno Adicionales:
{{#if (ne database "none")}}
- `DATABASE_URL`: URL de conexión a la base de datos {{database}}
- `DATABASE_PATH`: Ruta local de la base de datos (si aplica)
{{/if}}
{{#if (ne api_integrations "none")}}
- `API_KEY`: Clave principal para integraciones externas ({{api_integrations}})
- `API_BASE_URL`: URL base para APIs externas
{{/if}}
{{#if (ne notifications "none")}}
- `NOTIFICATION_SERVICE_KEY`: Clave del servicio de notificaciones ({{notifications}})
- `NOTIFICATION_CONFIG`: Configuración específica para {{notifications}}
{{/if}}

### Integraciones Requeridas:
{{#if (ne database "none")}}
- Base de datos {{database}} para persistencia de datos
{{/if}}
{{#if (ne api_integrations "none")}}
- Integraciones externas: {{api_integrations}}
{{/if}}
{{#if (ne notifications "none")}}
- Sistema de notificaciones: {{notifications}}
{{/if}}
- Manejo de errores robusto y logging detallado
- Cache local en memoria para optimizar rendimiento
- Validación de datos de entrada y salida

- Usaremos pnpm como administrador de paquetes.

## 📋 USAR COMO REFERENCIA:

Usa el documento "MCP_BEST_PRACTICES_GUIDE.md" como base para implementar todas las mejores prácticas, arquitectura y configuraciones técnicas necesarias.

El proyecto debe seguir exactamente los patrones y estándares definidos en ese documento de referencia.

## ✅ ENTREGA:

Proporciona el proyecto completo con todos los archivos, configuraciones y documentación siguiendo las mejores prácticas del documento de referencia.
```

---

## 🎉 ¡Tu Prompt Está Listo!

### 📋 Próximos Pasos:

1. **Copia el prompt completo** de la sección anterior
2. **Obtén las mejores prácticas** usando: `get_mcp_best_practices`
3. **Envía ambos documentos** a tu agente de IA favorito (Claude, GPT, etc.)
4. **¡Disfruta tu nuevo proyecto MCP profesional!**

### 💡 Consejos:

-   El prompt incluye todas las configuraciones que especificaste
-   Las herramientas se implementarán según el contexto de "{{domain}}"
-   La configuración es optimizada para tu caso de uso específico

### 🔄 ¿Quieres otro proyecto?

Simplemente usa este prompt nuevamente con diferentes parámetros para generar otro proyecto MCP personalizado.

---

## 📚 Guía Rápida de Uso:

### Ejemplo de uso completo:

```
domain: "gestión de tareas y proyectos"
tools: "create_task,list_tasks,update_task,delete_task,create_project,assign_task"
database: "sqlite"
transport: "stdio"
notifications: "email,telegram"
api_integrations: "OpenAI para análisis de productividad"
```

### Para proyectos simples:

```
domain: "convertidor de archivos"
tools: "convert_pdf,convert_image,merge_files"
database: "none"
transport: "stdio"
notifications: "none"
api_integrations: "none"
```

¡Personaliza según tus necesidades y genera tu MCP perfecto!
