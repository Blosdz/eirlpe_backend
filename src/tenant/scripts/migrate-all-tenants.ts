/**
 * Script de migración en cascada para todos los tenants.
 *
 * Uso:
 *   npx ts-node -r tsconfig-paths/register src/tenant/scripts/migrate-all-tenants.ts
 *
 * Variables de entorno requeridas: DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME, DB_SCHEMA
 *
 * Cómo funciona:
 *  1. Conecta a la BD principal y lista todos los hostnames.
 *  2. En cada BD de tenant crea (si no existe) la tabla `tenant_migration_history`.
 *  3. Solo ejecuta las migraciones que AÚN NO están registradas en esa tabla.
 *  4. Al completar cada migración exitosa la registra con timestamp.
 *  5. Imprime un resumen con skipped / applied / errores.
 *
 * Para agregar una migración nueva:
 *  - Añade un objeto { name, sql } al array TENANT_MIGRATIONS (al final).
 *  - Vuelve a correr: npm run migrate:tenants
 *  - El script saltea las ya aplicadas y solo corre la nueva.
 */

import 'dotenv/config';
import { DataSource } from 'typeorm';

// ─────────────────────────────────────────────────────────────────────────────
// TENANT_MIGRATIONS — agrega nuevas migraciones SIEMPRE al final del array.
// El nombre debe ser único y descriptivo. El orden de ejecución es el del array.
// ─────────────────────────────────────────────────────────────────────────────
const TENANT_MIGRATIONS: { name: string; sql: string }[] = [
  // ── v1 ── tablas base ─────────────────────────────────────────────────────
  {
    name: '001_add_name_to_tenant_contacts',
    sql: `ALTER TABLE tenant_contacts ADD COLUMN IF NOT EXISTS name VARCHAR(150)`,
  },
  {
    name: '002_create_tenant_config',
    sql: `
      CREATE TABLE IF NOT EXISTS tenant_config (
        id            SERIAL PRIMARY KEY,
        template_id   VARCHAR(255) NOT NULL,
        business_name VARCHAR(255),
        customization JSONB,
        is_active     BOOLEAN   DEFAULT TRUE,
        created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `,
  },
  {
    name: '003_create_tenant_plugins',
    sql: `
      CREATE TABLE IF NOT EXISTS tenant_plugins (
        id           SERIAL PRIMARY KEY,
        plugin_key   VARCHAR(100) NOT NULL UNIQUE,
        display_name VARCHAR(255) NOT NULL,
        is_active    BOOLEAN   DEFAULT FALSE,
        config       JSONB     DEFAULT '{}',
        created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `,
  },
  {
    name: '004_create_idx_tenant_plugins_key',
    sql: `CREATE INDEX IF NOT EXISTS idx_tp_key ON tenant_plugins(plugin_key)`,
  },
  {
    name: '005_seed_default_plugins',
    sql: `
      INSERT INTO tenant_plugins (plugin_key, display_name, is_active, config)
      VALUES
        ('ai_chatbot', 'AI Chatbot', false,
         '{"version":"1.0","ai_chatbot":{"enabled":false,"provider":"openai","model":"gpt-4o-mini","api_key":"","system_prompt":"","temperature":0.7,"max_tokens":500,"streaming":false}}'::jsonb),
        ('langchain',  'LangChain Agent', false,
         '{"version":"1.0","langchain":{"enabled":false,"chain_type":"conversation","memory_type":"buffer","tools":[]}}'::jsonb),
        ('whatsapp',   'WhatsApp Bot', false,
         '{"version":"1.0","whatsapp":{"enabled":false,"provider":"twilio","account_sid":"","auth_token":"","phone_number":""}}'::jsonb),
        ('email',      'Email Notifications', false,
         '{"version":"1.0","email":{"enabled":false,"provider":"resend","api_key":"","from_address":""}}'::jsonb)
      ON CONFLICT (plugin_key) DO NOTHING
    `,
  },

  // ── v2 ── agrega aquí las próximas migraciones ────────────────────────────
  // Ejemplo:
  // {
  //   name: '006_add_logo_url_to_tenant_config',
  //   sql: `ALTER TABLE tenant_config ADD COLUMN IF NOT EXISTS logo_url VARCHAR(500)`,
  // },
];

// ─────────────────────────────────────────────────────────────────────────────

function getDatabaseName(hostname: string): string {
  return `tenant_${hostname.replace(/[^a-z0-9]/gi, '_').toLowerCase()}`;
}

/** Crea la tabla de historial si no existe y devuelve los nombres ya aplicados */
async function bootstrapMigrationHistory(ds: DataSource): Promise<Set<string>> {
  await ds.query(`
    CREATE TABLE IF NOT EXISTS tenant_migration_history (
      id         SERIAL PRIMARY KEY,
      name       VARCHAR(255) NOT NULL UNIQUE,
      applied_at TIMESTAMP   DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const rows: { name: string }[] = await ds.query(
    `SELECT name FROM tenant_migration_history ORDER BY id`,
  );

  return new Set(rows.map((r) => r.name));
}

/** Registra una migración como completada */
async function recordMigration(ds: DataSource, name: string): Promise<void> {
  await ds.query(
    `INSERT INTO tenant_migration_history (name) VALUES ($1) ON CONFLICT (name) DO NOTHING`,
    [name],
  );
}

// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  // 1. Obtener todos los hostnames de la BD principal
  const mainDs = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    username: process.env.DB_USERNAME ?? 'postgres',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_NAME ?? 'eirl',
  });

  await mainDs.initialize();
  const schema = process.env.DB_SCHEMA ?? 'eirl';
  const rows: { hostname: string }[] = await mainDs.query(
    `SELECT hostname FROM "${schema}".hostnames ORDER BY id`,
  );
  await mainDs.destroy();

  if (rows.length === 0) {
    console.log('No hay tenants registrados. Nada que migrar.');
    return;
  }

  console.log(`\nMigrando ${rows.length} tenant(s) — ${TENANT_MIGRATIONS.length} migraciones definidas\n`);

  type TenantResult = {
    hostname: string;
    applied: string[];
    skipped: string[];
    errors: { name: string; message: string }[];
  };

  const summary: TenantResult[] = [];

  // 2. Por cada tenant
  for (const { hostname } of rows) {
    const dbName = getDatabaseName(hostname);
    const result: TenantResult = { hostname, applied: [], skipped: [], errors: [] };

    const tenantDs = new DataSource({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      username: process.env.DB_USERNAME ?? 'postgres',
      password: process.env.DB_PASSWORD ?? '',
      database: dbName,
    });

    try {
      await tenantDs.initialize();

      // 2a. Obtener migraciones ya aplicadas para este tenant
      const applied = await bootstrapMigrationHistory(tenantDs);

      // 2b. Ejecutar solo las pendientes
      for (const migration of TENANT_MIGRATIONS) {
        if (applied.has(migration.name)) {
          result.skipped.push(migration.name);
          process.stdout.write(`  ⊙ [${hostname}] ${migration.name} (skip)\n`);
          continue;
        }

        try {
          await tenantDs.query(migration.sql);
          await recordMigration(tenantDs, migration.name);
          result.applied.push(migration.name);
          process.stdout.write(`  ✔ [${hostname}] ${migration.name}\n`);
        } catch (err) {
          result.errors.push({ name: migration.name, message: err.message });
          process.stdout.write(`  ✘ [${hostname}] ${migration.name} → ${err.message}\n`);
        }
      }
    } catch (err) {
      result.errors.push({ name: 'CONEXIÓN', message: err.message });
      console.error(`  ✘ [${hostname}] No se pudo conectar a ${dbName}: ${err.message}`);
    } finally {
      if (tenantDs.isInitialized) await tenantDs.destroy();
    }

    summary.push(result);
  }

  // 3. Resumen final
  const totalApplied = summary.reduce((n, s) => n + s.applied.length, 0);
  const totalSkipped = summary.reduce((n, s) => n + s.skipped.length, 0);
  const totalErrors  = summary.reduce((n, s) => n + s.errors.length, 0);
  const failedTenants = summary.filter((s) => s.errors.length > 0);

  console.log(`\n${'─'.repeat(55)}`);
  console.log(`Tenants procesados : ${summary.length}`);
  console.log(`Migraciones nuevas : ${totalApplied}`);
  console.log(`Migraciones skip   : ${totalSkipped}`);
  console.log(`Errores            : ${totalErrors}`);

  if (failedTenants.length > 0) {
    console.log('\nTenants con errores:');
    for (const s of failedTenants) {
      console.log(`  • ${s.hostname}:`);
      s.errors.forEach((e) => console.log(`      [${e.name}] ${e.message}`));
    }
  }

  console.log(`${'─'.repeat(55)}\n`);
  process.exit(totalErrors > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('Error fatal:', err);
  process.exit(1);
});
