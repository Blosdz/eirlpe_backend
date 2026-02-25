"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var TenantConnectionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantConnectionService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("typeorm");
const tenant_entities_1 = require("../tenant-entities");
const POOL_PER_TENANT_MAX = 5;
const POOL_PER_TENANT_MIN = 1;
const MAX_ACTIVE_TENANTS = 50;
let TenantConnectionService = TenantConnectionService_1 = class TenantConnectionService {
    configService;
    logger = new common_1.Logger(TenantConnectionService_1.name);
    connections = new Map();
    constructor(configService) {
        this.configService = configService;
    }
    getDatabaseName(hostname) {
        return `tenant_${hostname.replace(/[^a-z0-9]/gi, '_').toLowerCase()}`;
    }
    async getConnection(hostname) {
        const dbName = this.getDatabaseName(hostname);
        const entry = this.connections.get(dbName);
        if (entry && entry.source.isInitialized) {
            entry.lastUsed = Date.now();
            return entry.source;
        }
        await this.evictIfNeeded();
        const dataSource = new typeorm_1.DataSource({
            type: 'postgres',
            host: this.configService.get('DB_HOST', 'localhost'),
            port: parseInt(this.configService.get('DB_PORT', '5432'), 10),
            username: this.configService.get('DB_USERNAME', 'postgres'),
            password: this.configService.get('DB_PASSWORD', ''),
            database: dbName,
            entities: [tenant_entities_1.TenantContact, tenant_entities_1.TenantUser, tenant_entities_1.TenantConfig, tenant_entities_1.TenantPlugin],
            synchronize: false,
            logging: this.configService.get('NODE_ENV') === 'development',
            extra: {
                max: POOL_PER_TENANT_MAX,
                min: POOL_PER_TENANT_MIN,
                idleTimeoutMillis: 30_000,
                connectionTimeoutMillis: 5_000,
            },
        });
        await dataSource.initialize();
        this.connections.set(dbName, { source: dataSource, lastUsed: Date.now() });
        this.logger.log(`Pool abierto para tenant: ${hostname} → ${dbName}`);
        return dataSource;
    }
    async createTenantDatabase(hostname) {
        const dbName = this.getDatabaseName(hostname);
        this.logger.log(`Creando base de datos para tenant: ${hostname} (${dbName})`);
        const adminDataSource = this.buildAdminDataSource();
        try {
            await adminDataSource.initialize();
            const dbExists = await adminDataSource.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);
            if (dbExists.length === 0) {
                await adminDataSource.query(`CREATE DATABASE "${dbName}"`);
                this.logger.log(`Base de datos ${dbName} creada`);
            }
            else {
                this.logger.log(`Base de datos ${dbName} ya existe`);
            }
            await adminDataSource.destroy();
            await this.initializeTenantTables(hostname);
        }
        catch (error) {
            this.logger.error(`Error al crear ${dbName}: ${error.message}`);
            throw error;
        }
    }
    async initializeTenantTables(hostname) {
        const dbName = this.getDatabaseName(hostname);
        const ds = new typeorm_1.DataSource({
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
        }
        finally {
            await ds.destroy();
        }
    }
    async runMigrationOnAllTenants(sql, tenantHostnames) {
        const results = [];
        for (const hostname of tenantHostnames) {
            try {
                const ds = await this.getConnection(hostname);
                await ds.query(sql);
                results.push({ hostname, success: true });
                this.logger.log(`Migración aplicada: ${hostname}`);
            }
            catch (error) {
                results.push({ hostname, success: false, error: error.message });
                this.logger.error(`Error en migración para ${hostname}: ${error.message}`);
            }
        }
        return results;
    }
    async tenantDatabaseExists(hostname) {
        const dbName = this.getDatabaseName(hostname);
        const admin = this.buildAdminDataSource();
        try {
            await admin.initialize();
            const result = await admin.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);
            return result.length > 0;
        }
        catch {
            return false;
        }
        finally {
            await admin.destroy();
        }
    }
    async closeConnection(hostname) {
        const dbName = this.getDatabaseName(hostname);
        const entry = this.connections.get(dbName);
        if (entry?.source.isInitialized) {
            await entry.source.destroy();
            this.connections.delete(dbName);
            this.logger.log(`Pool cerrado para tenant: ${hostname}`);
        }
    }
    async onModuleDestroy() {
        this.logger.log('Cerrando todos los pools de tenants...');
        for (const [dbName, entry] of this.connections) {
            if (entry.source.isInitialized) {
                await entry.source.destroy();
                this.logger.log(`Pool cerrado: ${dbName}`);
            }
        }
        this.connections.clear();
    }
    async evictIfNeeded() {
        if (this.connections.size < MAX_ACTIVE_TENANTS)
            return;
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
    buildAdminDataSource() {
        return new typeorm_1.DataSource({
            type: 'postgres',
            host: this.configService.get('DB_HOST', 'localhost'),
            port: parseInt(this.configService.get('DB_PORT', '5432'), 10),
            username: this.configService.get('DB_USERNAME', 'postgres'),
            password: this.configService.get('DB_PASSWORD', ''),
            database: 'postgres',
        });
    }
};
exports.TenantConnectionService = TenantConnectionService;
exports.TenantConnectionService = TenantConnectionService = TenantConnectionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], TenantConnectionService);
//# sourceMappingURL=tenant-connection.service.js.map