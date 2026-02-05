import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { TenantContact, TenantUser } from '../tenant-entities';

@Injectable()
export class TenantConnectionService implements OnModuleDestroy {
  private readonly logger = new Logger(TenantConnectionService.name);
  private connections = new Map<string, DataSource>();

  constructor(private configService: ConfigService) {}

  private getDatabaseName(hostname: string): string {
    return `tenant_${hostname.replace(/-/g, '_')}`;
  }

  async getConnection(hostname: string): Promise<DataSource> {
    const dbName = this.getDatabaseName(hostname);

    const existingConn = this.connections.get(dbName);
    if (existingConn && existingConn.isInitialized) {
      return existingConn;
    }

    const dataSource = new DataSource({
      type: 'postgres',
      host: this.configService.get('DB_HOST', 'localhost'),
      port: parseInt(this.configService.get('DB_PORT', '5432'), 10),
      username: this.configService.get('DB_USERNAME', 'postgres'),
      password: this.configService.get('DB_PASSWORD', ''),
      database: dbName,
      entities: [TenantContact, TenantUser],
      synchronize: false,
      logging: this.configService.get('NODE_ENV') === 'development',
    });

    await dataSource.initialize();
    this.connections.set(dbName, dataSource);
    this.logger.log(`Connection established for tenant: ${hostname} (${dbName})`);

    return dataSource;
  }

  async createTenantDatabase(hostname: string): Promise<void> {
    const dbName = this.getDatabaseName(hostname);
    this.logger.log(`Creating database for tenant: ${hostname} (${dbName})`);

    const adminDataSource = new DataSource({
      type: 'postgres',
      host: this.configService.get('DB_HOST', 'localhost'),
      port: parseInt(this.configService.get('DB_PORT', '5432'), 10),
      username: this.configService.get('DB_USERNAME', 'postgres'),
      password: this.configService.get('DB_PASSWORD', ''),
      database: 'postgres',
    });

    try {
      await adminDataSource.initialize();

      const dbExists = await adminDataSource.query(
        `SELECT 1 FROM pg_database WHERE datname = $1`,
        [dbName],
      );

      if (dbExists.length === 0) {
        await adminDataSource.query(`CREATE DATABASE "${dbName}"`);
        this.logger.log(`Database ${dbName} created successfully`);
      } else {
        this.logger.log(`Database ${dbName} already exists`);
      }

      await adminDataSource.destroy();

      await this.initializeTenantTables(hostname);
    } catch (error) {
      this.logger.error(`Failed to create database ${dbName}: ${error.message}`);
      throw error;
    }
  }

  private async initializeTenantTables(hostname: string): Promise<void> {
    const dbName = this.getDatabaseName(hostname);

    const tenantDataSource = new DataSource({
      type: 'postgres',
      host: this.configService.get('DB_HOST', 'localhost'),
      port: parseInt(this.configService.get('DB_PORT', '5432'), 10),
      username: this.configService.get('DB_USERNAME', 'postgres'),
      password: this.configService.get('DB_PASSWORD', ''),
      database: dbName,
    });

    try {
      await tenantDataSource.initialize();

      await tenantDataSource.query(`
        CREATE TABLE IF NOT EXISTS tenant_contacts (
          id SERIAL PRIMARY KEY,
          phone VARCHAR(20),
          mail VARCHAR(255),
          message TEXT,
          contact_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          status VARCHAR(50) DEFAULT 'pending'
        )
      `);

      await tenantDataSource.query(`
        CREATE INDEX IF NOT EXISTS idx_tenant_contacts_status ON tenant_contacts(status)
      `);

      await tenantDataSource.query(`
        CREATE INDEX IF NOT EXISTS idx_tenant_contacts_date ON tenant_contacts(contact_date)
      `);

      await tenantDataSource.query(`
        CREATE TABLE IF NOT EXISTS tenant_users (
          id SERIAL PRIMARY KEY,
          mail VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          name VARCHAR(100),
          status VARCHAR(50) DEFAULT 'active',
          role VARCHAR(50) DEFAULT 'user',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          last_login_at TIMESTAMP
        )
      `);

      await tenantDataSource.query(`
        CREATE INDEX IF NOT EXISTS idx_tenant_users_mail ON tenant_users(mail)
      `);

      await tenantDataSource.query(`
        CREATE INDEX IF NOT EXISTS idx_tenant_users_status ON tenant_users(status)
      `);

      this.logger.log(`Tables created for tenant: ${hostname}`);
      await tenantDataSource.destroy();
    } catch (error) {
      this.logger.error(`Failed to initialize tables for ${dbName}: ${error.message}`);
      throw error;
    }
  }

  async tenantDatabaseExists(hostname: string): Promise<boolean> {
    const dbName = this.getDatabaseName(hostname);

    const adminDataSource = new DataSource({
      type: 'postgres',
      host: this.configService.get('DB_HOST', 'localhost'),
      port: parseInt(this.configService.get('DB_PORT', '5432'), 10),
      username: this.configService.get('DB_USERNAME', 'postgres'),
      password: this.configService.get('DB_PASSWORD', ''),
      database: 'postgres',
    });

    try {
      await adminDataSource.initialize();
      const result = await adminDataSource.query(
        `SELECT 1 FROM pg_database WHERE datname = $1`,
        [dbName],
      );
      await adminDataSource.destroy();
      return result.length > 0;
    } catch (error) {
      this.logger.error(`Failed to check database existence: ${error.message}`);
      return false;
    }
  }

  async closeConnection(hostname: string): Promise<void> {
    const dbName = this.getDatabaseName(hostname);
    const conn = this.connections.get(dbName);

    if (conn && conn.isInitialized) {
      await conn.destroy();
      this.connections.delete(dbName);
      this.logger.log(`Connection closed for tenant: ${hostname}`);
    }
  }

  async onModuleDestroy(): Promise<void> {
    this.logger.log('Closing all tenant connections...');
    for (const [dbName, conn] of this.connections) {
      if (conn.isInitialized) {
        await conn.destroy();
        this.logger.log(`Connection closed: ${dbName}`);
      }
    }
    this.connections.clear();
  }
}
