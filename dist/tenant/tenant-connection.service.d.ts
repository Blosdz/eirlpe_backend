import { OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
export declare class TenantConnectionService implements OnModuleDestroy {
    private configService;
    private readonly logger;
    private connections;
    constructor(configService: ConfigService);
    private getDatabaseName;
    getConnection(hostname: string): Promise<DataSource>;
    createTenantDatabase(hostname: string): Promise<void>;
    private initializeTenantTables;
    runMigrationOnAllTenants(sql: string, tenantHostnames: string[]): Promise<{
        hostname: string;
        success: boolean;
        error?: string;
    }[]>;
    tenantDatabaseExists(hostname: string): Promise<boolean>;
    closeConnection(hostname: string): Promise<void>;
    onModuleDestroy(): Promise<void>;
    private evictIfNeeded;
    private buildAdminDataSource;
}
