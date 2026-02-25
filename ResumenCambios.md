Resumen de cambios
Archivos nuevos
Archivo Propósito
tenant-config.entity.ts Entidad tenant_config con template_id + JSONB de personalización
tenant-plugin.entity.ts Entidad tenant_plugins con JSONB + tipos TypeScript para IA
tenant-config/ Módulo completo: service, controller, DTO
tenant-plugins/ Módulo completo: service, controller, DTO
migrate-all-tenants.ts Script de migración en cascada
Archivos modificados
Archivo Cambio
tenant-contact.entity.ts Añadido campo name VARCHAR(150)
tenant-entities/index.ts Exporta las 2 nuevas entidades
tenant-connection.service.ts Pool LRU + creación de las 4 tablas + seed de plugins
database.sql Tabla eirl.template descomentada y activa
app.module.ts Importa TenantConfigModule y TenantPluginsModule
package.json Script migrate:tenants
Connection Pooling — Explicación

PostgreSQL max_connections = 100 (default)
┌──────────────────┐
│ NestJS Process │
│ │
tenant-a ──► │ DataSource [5] │ ← máx 5 conexiones pg por tenant
tenant-b ──► │ DataSource [5] │
tenant-c ──► │ DataSource [5] │
... │ ... │
MAX 50 tenants│ │
= 250 conns │ LRU eviction │ ← cierra el menos usado si llega a 50
└──────────────────┘
Cada DataSource usa el pool interno de pg configurado con extra: { max: 5, min: 1, idleTimeoutMillis: 30000 }. El Map<dbName, {source, lastUsed}> actúa como cache LRU: cuando se supera MAX_ACTIVE_TENANTS=50 se destruye el pool del tenant con acceso más antiguo.

Migraciones en cascada
Para aplicar un ALTER TABLE a todos los tenants existentes:

# Aplica TENANT_MIGRATIONS a todas las BDs registradas en hostnames

npm run migrate:tenants
Para añadir una nueva migración futura, agrega un objeto al array TENANT_MIGRATIONS en migrate-all-tenants.ts. Las sentencias son idempotentes (IF NOT EXISTS, ON CONFLICT DO NOTHING).

JSON de tenant_plugins — Estructura de IA

// PATCH /tenant-plugins/ai_chatbot { "isActive": true, "config": { ... } }
{
"version": "1.0",
"ai_chatbot": {
"enabled": true,
"provider": "openai", // openai | anthropic | gemini
"model": "gpt-4o-mini",
"api_key": "sk-...", // ⚠ cifrar con AES-256 antes de guardar
"system_prompt": "Eres asistente de <empresa>...",
"temperature": 0.7,
"max_tokens": 500,
"streaming": false
},
"langchain": {
"enabled": false,
"chain_type": "conversation", // qa | summary | conversation
"memory_type": "buffer", // buffer | summary | vector
"vector_store": { "provider": "pinecone", "index": "...", "api_key": "..." },
"tools": ["web_search"]
}
}
