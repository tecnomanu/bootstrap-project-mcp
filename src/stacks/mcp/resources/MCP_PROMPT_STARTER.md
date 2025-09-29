# 🚀 Prompt Inicial para Crear un MCP Server

## 📋 Copia y Pega Este Prompt

```
Necesito crear un proyecto MCP (Model Context Protocol) completo y profesional para {DOMINIO_ESPECÍFICO}.

## 🎯 HERRAMIENTAS MCP REQUERIDAS:

{LISTA_DE_HERRAMIENTAS}

## 🔧 CONFIGURACIÓN ESPECÍFICA:

### Variables de Entorno Adicionales:
{VARIABLES_ENTORNO_EXTRA}

### Integraciones Requeridas:
{INTEGRACIONES_ESPECÍFICAS}

## 📋 USAR COMO REFERENCIA:

Usa el documento "MCP_BEST_PRACTICES_GUIDE.md" como base para implementar todas las mejores prácticas, arquitectura y configuraciones técnicas necesarias.

El proyecto debe seguir exactamente los patrones y estándares definidos en ese documento de referencia.

## ✅ ENTREGA:

Proporciona el proyecto completo con todos los archivos, configuraciones y documentación siguiendo las mejores prácticas del documento de referencia.
```

---

## 🎯 Ejemplos de Uso

### Ejemplo 1: MCP para Sistema Meteorológico

```
Necesito crear un proyecto MCP (Model Context Protocol) completo y profesional para un sistema de información meteorológica.

## 🎯 HERRAMIENTAS MCP REQUERIDAS:

- `get_weather_data`: Obtener datos meteorológicos actuales de una ubicación
- `get_forecast`: Obtener pronóstico del tiempo para los próximos días
- `analyze_climate_trends`: Analizar tendencias climáticas históricas
- `get_weather_alerts`: Obtener alertas meteorológicas activas
- `compare_locations`: Comparar clima entre diferentes ubicaciones

## 🔧 CONFIGURACIÓN ESPECÍFICA:

### Variables de Entorno Adicionales:
- `WEATHER_API_KEY`: Clave de API del servicio meteorológico
- `DEFAULT_LOCATION`: Ubicación por defecto
- `CACHE_DURATION`: Duración del cache de datos (en minutos)
- `ALERT_THRESHOLD`: Umbral para alertas automáticas
- `TELEGRAM_TOKEN`: Token para notificaciones opcionales vía Telegram

- Usaremos de administrador de paquetes pnpm.

### Integraciones Requeridas:
- API externa: OpenWeatherMap o similar
- Base de datos: SQLite para históricos
- Cache: Cache local en memoria
- Notificaciones: Opcionales vía Telegram si se proporciona `TELEGRAM_TOKEN`

## 📋 USAR COMO REFERENCIA:

Usa el documento "MCP_BEST_PRACTICES_GUIDE.md" como base para implementar todas las mejores prácticas, arquitectura y configuraciones técnicas necesarias.

El proyecto debe seguir exactamente los patrones y estándares definidos en ese documento de referencia.

## ✅ ENTREGA:

Proporciona el proyecto completo con todos los archivos, configuraciones y documentación siguiendo las mejores prácticas del documento de referencia.
```

### Ejemplo 2: MCP para E-commerce

```
Necesito crear un proyecto MCP (Model Context Protocol) completo y profesional para un sistema de e-commerce.

## 🎯 HERRAMIENTAS MCP REQUERIDAS:

- `get_products`: Obtener lista de productos con filtros
- `get_product_details`: Obtener detalles específicos de un producto
- `manage_cart`: Agregar/quitar productos del carrito
- `process_order`: Procesar una orden de compra
- `track_shipment`: Rastrear estado de envío
- `get_recommendations`: Obtener recomendaciones personalizadas

## 🔧 CONFIGURACIÓN ESPECÍFICA:

### Variables de Entorno Adicionales:
- `DATABASE_URL`: URL de la base de datos de productos
- `PAYMENT_GATEWAY_KEY`: Clave del gateway de pagos
- `SHIPPING_API_KEY`: API para cálculos de envío
- `RECOMMENDATION_MODEL_URL`: URL del modelo de ML para recomendaciones

### Integraciones Requeridas:
- Base de datos: MongoDB para catálogo de productos
- Payment Gateway: Stripe o MercadoPago
- Shipping API: Correo Argentino / OCA
- ML Service: Sistema de recomendaciones con IA

## 📋 USAR COMO REFERENCIA:

Usa el documento "MCP_BEST_PRACTICES_GUIDE.md" como base para implementar todas las mejores prácticas, arquitectura y configuraciones técnicas necesarias.

El proyecto debe seguir exactamente los patrones y estándares definidos en ese documento de referencia.

## ✅ ENTREGA:

Proporciona el proyecto completo con todos los archivos, configuraciones y documentación siguiendo las mejores prácticas del documento de referencia.
```

### Ejemplo 3: MCP para Sistema de Logs

```
Necesito crear un proyecto MCP (Model Context Protocol) completo y profesional para análisis de logs de sistemas.

## 🎯 HERRAMIENTAS MCP REQUERIDAS:

- `search_logs`: Buscar logs por patrones o fechas
- `analyze_errors`: Analizar errores y excepciones
- `get_metrics`: Obtener métricas de rendimiento
- `detect_anomalies`: Detectar anomalías en logs
- `generate_report`: Generar reportes de análisis
- `alert_on_pattern`: Configurar alertas por patrones específicos

## 🔧 CONFIGURACIÓN ESPECÍFICA:

### Variables de Entorno Adicionales:
- `LOG_SOURCES`: Fuentes de logs (archivos, APIs, databases)
- `ELASTICSEARCH_URL`: URL del cluster de Elasticsearch
- `ALERT_WEBHOOK`: Webhook para envío de alertas
- `RETENTION_DAYS`: Días de retención de logs

### Integraciones Requeridas:
- Elasticsearch: Para indexación y búsqueda de logs
- Kibana: Para visualización (opcional)
- Slack/Teams: Para notificaciones de alertas
- Prometheus: Para métricas de sistema

## 📋 USAR COMO REFERENCIA:

Usa el documento "MCP_BEST_PRACTICES_GUIDE.md" como base para implementar todas las mejores prácticas, arquitectura y configuraciones técnicas necesarias.

El proyecto debe seguir exactamente los patrones y estándares definidos en ese documento de referencia.

## ✅ ENTREGA:

Proporciona el proyecto completo con todos los archivos, configuraciones y documentación siguiendo las mejores prácticas del documento de referencia.
```

---

## 🔧 Cómo Usar Este Template

### Paso 1: Personalizar el Prompt

1. Reemplaza `{DOMINIO_ESPECÍFICO}` con tu dominio (ej: "sistema meteorológico")
2. Reemplaza `{LISTA_DE_HERRAMIENTAS}` con tus herramientas específicas
3. Reemplaza `{VARIABLES_ENTORNO_EXTRA}` con tus variables adicionales
4. Reemplaza `{INTEGRACIONES_ESPECÍFICAS}` con tus integraciones

### Paso 2: Enviar a la IA

1. Copia el prompt personalizado
2. Adjunta el archivo `MCP_BEST_PRACTICES_GUIDE.md`
3. Envía ambos a tu IA favorita (Claude, GPT, etc.)

### Paso 3: Obtener el Proyecto

La IA generará un proyecto MCP completo siguiendo todas las mejores prácticas del documento de referencia.

### Paso 4: Testing Inmediato

Una vez generado el proyecto, podrás probarlo inmediatamente:

```bash
# Instalar dependencias
pnpm install

# Probar con MCP Inspector
pnpm run inspector

# Desarrollo
pnpm run dev
```

---

## 📚 Archivos de Soporte

-   `MCP_BEST_PRACTICES_GUIDE.md` - Documento técnico con todas las mejores prácticas
-   `README.md` - Documentación del proyecto Nerdearla como ejemplo

---

**🎯 Este prompt inicial es conciso y fácil de personalizar, mientras que el documento de soporte proporciona toda la profundidad técnica necesaria.**
