import { PluginConfig } from '../../tenant-entities';
export declare class UpdatePluginDto {
    isActive?: boolean;
    config?: Partial<PluginConfig>;
}
