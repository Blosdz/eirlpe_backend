import { TenantContextService } from '../tenant/tenant-context.service';
import { TenantPlugin } from '../tenant-entities';
import { UpdatePluginDto } from './dto/update-plugin.dto';
export declare class TenantPluginsService {
    private readonly tenantContextService;
    constructor(tenantContextService: TenantContextService);
    private getRepository;
    findAll(): Promise<TenantPlugin[]>;
    findByKey(pluginKey: string): Promise<TenantPlugin>;
    update(pluginKey: string, dto: UpdatePluginDto): Promise<TenantPlugin>;
    getActivePlugins(): Promise<TenantPlugin[]>;
}
