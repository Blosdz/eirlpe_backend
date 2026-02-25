import { Repository } from 'typeorm';
import { Hostname } from '../entities';
import { TenantConnectionService } from './tenant-connection.service';
export declare class TenantService {
    private hostnameRepository;
    private tenantConnectionService;
    private hostnameCache;
    private notFoundCache;
    private notFoundExpiry;
    private readonly CACHE_TTL;
    private readonly NOT_FOUND_TTL;
    constructor(hostnameRepository: Repository<Hostname>, tenantConnectionService: TenantConnectionService);
    resolveHostname(hostname: string): Promise<{
        id: number;
        hostname: string;
    } | null>;
    validateTenantExists(tenantId: number): Promise<boolean>;
    getHostnameById(tenantId: number): Promise<Hostname>;
    createTenantDatabase(hostname: string): Promise<void>;
    tenantDatabaseExists(hostname: string): Promise<boolean>;
    clearCache(): void;
}
