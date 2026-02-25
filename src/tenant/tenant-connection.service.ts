import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { TenantContact, TenantUser, TenantConfig, TenantPlugin } from '../tenant-entities';

/**
 * Connection Pool Strategy:
 * - Cada tenant tiene UN DataSource (TypeORM) persistido en el Map.
 * - Cada DataSource usa el pool interno de `pg` con límites configurados.
 * - Por defecto: máx. 5 conexiones por tenant para no saturar PostgreSQL.
 *   Con 20 tenants simultáneos eso son 100 conexiones en total (bien dentro
 *   del límite predeterminado de PostgreSQL: max_connections = 100-200).
 * - Política de evicción LRU (Least Recently Used): si se supera MAX_POOL_SIZE
 *   tenants activos, se cierra el tenant con acceso más antiguo.
 */

const POOL_PER_TENANT_MAX = 5;   // conexiones pg por tenant
const POOL_PER_TENANT_MIN = 1;   // conexiones mínimas idle
const MAX_ACTIVE_TENANTS = 50;   // máx. DataSources abiertos simultáneamente

@Injectable()
export class TenantConnectionService implements OnModuleDestroy {
  private readonly logger = new Logger(TenantConnectionService.name);

  // Map<dbName, { source, lastUsed }>
  private connections = new Map<string, { source: DataSource; lastUsed: number }>();

  constructor(private configService: ConfigService) {}

  private getDatabaseName(hostname: string): string {
    return `tenant_${hostname.replace(/[^a-z0-9]/gi, '_').toLowerCase()}`;
  }

  // ──────────────────────────────────────────────────────
  // Obtener (o crear) la conexión al tenant con pooling
  // ──────────────────────────────────────────────────────
  async getConnection(hostname: string): Promise<DataSource> {
    const dbName = this.getDatabaseName(hostname);
    const entry = this.connections.get(dbName);

    if (entry && entry.source.isInitialized) {
      entry.lastUsed = Date.now(); // actualizar LRU
      return entry.source;
    }

    // Evicción LRU antes de crear una nueva conexión
    await this.evictIfNeeded();

    const dataSource = new DataSource({
      type: 'postgres',
      host: this.configService.get('DB_HOST', 'localhost'),
      port: parseInt(this.configService.get('DB_PORT', '5432'), 10),
      username: this.configService.get('DB_USERNAME', 'postgres'),
      password: this.configService.get('DB_PASSWORD', ''),
      database: dbName,
      entities: [TenantContact, TenantUser, TenantConfig, TenantPlugin],
      synchronize: false,
      logging: this.configService.get('NODE_ENV') === 'development',
      // ── Pool de conexiones por tenant ──────────────────
      extra: {
        max: POOL_PER_TENANT_MAX,   // máx. conexiones pg abiertas
        min: POOL_PER_TENANT_MIN,   // idle mínimas (evita cold-start)
        idleTimeoutMillis: 30_000,  // cerrar conexiones idle > 30s
        connectionTimeoutMillis: 5_000,
      },
    });

    await dataSource.initialize();
    this.connections.set(dbName, { source: dataSource, lastUsed: Date.now() });
    this.logger.log(`Pool abierto para tenant: ${hostname} → ${dbName}`);

    return dataSource;
  }

  // ──────────────────────────────────────────────────────
  // Crear la base de datos del tenant + tablas iniciales
  // ──────────────────────────────────────────────────────
  async createTenantDatabase(hostname: string): Promise<void> {
    const dbName = this.getDatabaseName(hostname);
    this.logger.log(`Creando base de datos para tenant: ${hostname} (${dbName})`);

    const adminDataSource = this.buildAdminDataSource();

    try {
      await adminDataSource.initialize();

      const dbExists = await adminDataSource.query(
        `SELECT 1 FROM pg_database WHERE datname = $1`,
        [dbName],
      );

      if (dbExists.length === 0) {
        // CREATE DATABASE no soporta parámetros, el nombre ya está sanitizado
        await adminDataSource.query(`CREATE DATABASE "${dbName}"`);
        this.logger.log(`Base de datos ${dbName} creada`);
      } else {
        this.logger.log(`Base de datos ${dbName} ya existe`);
      }

      await adminDataSource.destroy();
      await this.initializeTenantTables(hostname);
    } catch (error) {
      this.logger.error(`Error al crear ${dbName}: ${error.message}`);
      throw error;
    }
  }

  // ──────────────────────────────────────────────────────
  // Migraciones iniciales del tenant (idempotentes)
  // ──────────────────────────────────────────────────────
  private async initializeTenantTables(hostname: string): Promise<void> {
    const dbName = this.getDatabaseName(hostname);
    const ds = new DataSource({
      type: 'postgres',
      host: this.configService.get('DB_HOST', 'localhost'),
      port: parseInt(this.configService.get('DB_PORT', '5432'), 10),
      username: this.configService.get('DB_USERNAME', 'postgres'),
      password: this.configService.get('DB_PASSWORD', ''),
      database: dbName,
    });

    try {
      await ds.initialize();
      await ds.transaction(async (manager) => {
        // ── tenant_contacts ────────────────────────────
        await manager.query(`
          CREATE TABLE IF NOT EXISTS tenant_contacts (
            id           SERIAL PRIMARY KEY,
            name         VARCHAR(150),
            phone        VARCHAR(20),
            mail         VARCHAR(255),
            message      TEXT,
            contact_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            status       VARCHAR(50) DEFAULT 'pending'
          )
        `);
        await manager.query(`CREATE INDEX IF NOT EXISTS idx_tc_status ON tenant_contacts(status)`);
        await manager.query(`CREATE INDEX IF NOT EXISTS idx_tc_date   ON tenant_contacts(contact_date)`);

        // ── tenant_users ───────────────────────────────
        await manager.query(`
          CREATE TABLE IF NOT EXISTS tenant_users (
            id            SERIAL PRIMARY KEY,
            mail          VARCHAR(255) NOT NULL UNIQUE,
            password      VARCHAR(255) NOT NULL,
            name          VARCHAR(100),
            status        VARCHAR(50)  DEFAULT 'active',
            role          VARCHAR(50)  DEFAULT 'user',
            created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
            updated_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
            last_login_at TIMESTAMP
          )
        `);
        await manager.query(`CREATE INDEX IF NOT EXISTS idx_tu_mail   ON tenant_users(mail)`);
        await manager.query(`CREATE INDEX IF NOT EXISTS idx_tu_status ON tenant_users(status)`);

        // ── tenant_config ──────────────────────────────
        await manager.query(`
          CREATE TABLE IF NOT EXISTS tenant_config (
            id            SERIAL PRIMARY KEY,
            template_id   VARCHAR(255) NOT NULL,
            business_name VARCHAR(255),
            customization JSONB,
            is_active     BOOLEAN      DEFAULT TRUE,
            created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
            updated_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // ── tenant_plugins ─────────────────────────────
        await manager.query(`
          CREATE TABLE IF NOT EXISTS tenant_plugins (
            id           SERIAL PRIMARY KEY,
            plugin_key   VARCHAR(100) NOT NULL UNIQUE,
            display_name VARCHAR(255) NOT NULL,
            is_active    BOOLEAN      DEFAULT FALSE,
            config       JSONB        DEFAULT '{}',
            created_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
            updated_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
          )
        `);
        await manager.query(`CREATE INDEX IF NOT EXISTS idx_tp_key ON tenant_plugins(plugin_key)`);

        // Seed: insertar plugins predeterminados (desactivados)
        await manager.query(`
          INSERT INTO tenant_plugins (plugin_key, display_name, is_active, config)
          VALUES
            ('ai_chatbot', 'AI Chatbot', false, '{"version":"1.0","ai_chatbot":{"enabled":false,"provider":"openai","model":"gpt-4o-mini","api_key":"","system_prompt":"","temperature":0.7,"max_tokens":500,"streaming":false}}'::jsonb),
            ('langchain',  'LangChain Agent', false, '{"version":"1.0","langchain":{"enabled":false,"chain_type":"conversation","memory_type":"buffer","tools":[]}}'::jsonb),
            ('whatsapp',   'WhatsApp Bot', false, '{"version":"1.0","whatsapp":{"enabled":false,"provider":"twilio","account_sid":"","auth_token":"","phone_number":""}}'::jsonb),
            ('email',      'Email Notifications', false, '{"version":"1.0","email":{"enabled":false,"provider":"resend","api_key":"","from_address":""}}'::jsonb)
          ON CONFLICT (plugin_key) DO NOTHING
        `);
      });

      this.logger.log(`Tablas inicializadas para tenant: ${hostname}`);
    } finally {
      await ds.destroy();
    }
  }

  // ──────────────────────────────────────────────────────
  // Migración en cascada: aplicar ALTER TABLE a todos los tenants
  // ──────────────────────────────────────────────────────
  async runMigrationOnAllTenants(
    sql: string,
    tenantHostnames: string[],
  ): Promise<{ hostname: string; success: boolean; error?: string }[]> {
    const results: { hostname: string; success: boolean; error?: string }[] = [];

    for (const hostname of tenantHostnames) {
      try {
        const ds = await this.getConnection(hostname);
        await ds.query(sql);
        results.push({ hostname, success: true });
        this.logger.log(`Migración aplicada: ${hostname}`);
      } catch (error) {
        results.push({ hostname, success: false, error: error.message });
        this.logger.error(`Error en migración para ${hostname}: ${error.message}`);
      }
    }

    return results;
  }

  // ──────────────────────────────────────────────────────
  // Comprobar si la DB del tenant existe
  // ──────────────────────────────────────────────────────
  async tenantDatabaseExists(hostname: string): Promise<boolean> {
    const dbName = this.getDatabaseName(hostname);
    const admin = this.buildAdminDataSource();

    try {
      await admin.initialize();
      const result = await admin.query(
        `SELECT 1 FROM pg_database WHERE datname = $1`,
        [dbName],
      );
      return result.length > 0;
    } catch {
      return false;
    } finally {
      await admin.destroy();
    }
  }

  // ──────────────────────────────────────────────────────
  // Cierre individual y cleanup global
  // ──────────────────────────────────────────────────────
  async closeConnection(hostname: string): Promise<void> {
    const dbName = this.getDatabaseName(hostname);
    const entry = this.connections.get(dbName);

    if (entry?.source.isInitialized) {
      await entry.source.destroy();
      this.connections.delete(dbName);
      this.logger.log(`Pool cerrado para tenant: ${hostname}`);
    }
  }

  async onModuleDestroy(): Promise<void> {
    this.logger.log('Cerrando todos los pools de tenants...');
    for (const [dbName, entry] of this.connections) {
      if (entry.source.isInitialized) {
        await entry.source.destroy();
        this.logger.log(`Pool cerrado: ${dbName}`);
      }
    }
    this.connections.clear();
  }

  // ──────────────────────────────────────────────────────
  // Helpers privados
  // ──────────────────────────────────────────────────────

  /** Cierra el tenant con lastUsed más antiguo si se supera MAX_ACTIVE_TENANTS */
  private async evictIfNeeded(): Promise<void> {
    if (this.connections.size < MAX_ACTIVE_TENANTS) return;

    let oldestKey = '';
    let oldestTime = Infinity;

    for (const [key, entry] of this.connections) {
      if (entry.lastUsed < oldestTime) {
        oldestTime = entry.lastUsed;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      const entry = this.connections.get(oldestKey);
      if (entry?.source.isInitialized) {
        await entry.source.destroy();
      }
      this.connections.delete(oldestKey);
      this.logger.warn(`LRU eviction: pool cerrado para ${oldestKey}`);
    }
  }

  private buildAdminDataSource(): DataSource {
    return new DataSource({
      type: 'postgres',
      host: this.configService.get('DB_HOST', 'localhost'),
      port: parseInt(this.configService.get('DB_PORT', '5432'), 10),
      username: this.configService.get('DB_USERNAME', 'postgres'),
      password: this.configService.get('DB_PASSWORD', ''),
      database: 'postgres',
    });
  }
}
