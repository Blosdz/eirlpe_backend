import { IsString, IsBoolean, IsObject, IsOptional, MinLength } from 'class-validator';

export class UpsertTenantConfigDto {
  @IsString()
  @MinLength(1)
  templateId: string;

  @IsString()
  @IsOptional()
  businessName?: string;

  @IsObject()
  @IsOptional()
  customization?: Record<string, unknown>;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
