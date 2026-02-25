import { TenantPluginsService } from './tenant-plugins.service';
import { UpdatePluginDto } from './dto/update-plugin.dto';
export declare class TenantPluginsController {
    private readonly service;
    constructor(service: TenantPluginsService);
    getActive(): Promise<import("../tenant-entities").TenantPlugin[]>;
    findAll(): Promise<import("../tenant-entities").TenantPlugin[]>;
    findOne(key: string): Promise<import("../tenant-entities").TenantPlugin>;
    update(key: string, dto: UpdatePluginDto): Promise<import("../tenant-entities").TenantPlugin>;
}
