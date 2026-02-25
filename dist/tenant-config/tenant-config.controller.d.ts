import { TenantConfigService } from './tenant-config.service';
import { UpsertTenantConfigDto } from './dto/upsert-tenant-config.dto';
export declare class TenantConfigController {
    private readonly service;
    constructor(service: TenantConfigService);
    getConfig(): Promise<import("../tenant-entities").TenantConfig>;
    getEditorData(): Promise<{
        templateId: string | null;
        fields: {
            key: string;
            label: string;
            group: string;
            hint: string | null;
            defaultValue: string;
            currentValue: string;
        }[];
    }>;
    upsert(dto: UpsertTenantConfigDto): Promise<import("../tenant-entities").TenantConfig>;
}
