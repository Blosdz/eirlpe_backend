import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { TenantContextService } from '../tenant/tenant-context.service';
import { TenantConfig } from '../tenant-entities';
import { UpsertTenantConfigDto } from './dto/upsert-tenant-config.dto';

@Injectable()
export class TenantConfigService {
  constructor(private readonly tenantContextService: TenantContextService) {}

  private getRepository() {
    const connection = this.tenantContextService.getConnection();
    if (!connection) throw new BadRequestException('Tenant connection not available');
    return connection.getRepository(TenantConfig);
  }

  async getConfig(): Promise<TenantConfig> {
    const repo = this.getRepository();
    const config = await repo.findOne({ where: { isActive: true } });
    if (!config) throw new NotFoundException('Config not found for this tenant');
    return config;
  }

  /** Crea o actualiza la configuración del tenant (upsert) */
  async upsert(dto: UpsertTenantConfigDto): Promise<TenantConfig> {
    const repo = this.getRepository();
    let config = await repo.findOne({ where: { isActive: true } });

    if (config) {
      config.templateId = dto.templateId;
      if (dto.businessName !== undefined) config.businessName = dto.businessName;
      if (dto.customization !== undefined) config.customization = dto.customization;
      if (dto.isActive !== undefined) config.isActive = dto.isActive;
    } else {
      config = repo.create({
        templateId: dto.templateId,
        businessName: dto.businessName,
        customization: dto.customization ?? {},
        isActive: dto.isActive ?? true,
      });
    }

    return repo.save(config);
  }
}
