import { TenantContextService } from '../tenant/tenant-context.service';
import { TenantConfig } from '../tenant-entities';
import { UpsertTenantConfigDto } from './dto/upsert-tenant-config.dto';
export declare class TenantConfigService {
    private readonly tenantContextService;
    constructor(tenantContextService: TenantContextService);
    private getRepository;
    getConfig(): Promise<TenantConfig>;
    upsert(dto: UpsertTenantConfigDto): Promise<TenantConfig>;
}
