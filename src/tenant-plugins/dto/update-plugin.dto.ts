import { IsBoolean, IsObject, IsOptional } from 'class-validator';
import { PluginConfig } from '../../tenant-entities';

export class UpdatePluginDto {
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsObject()
  @IsOptional()
  config?: Partial<PluginConfig>;
}
