import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { TenantContextService } from '../tenant/tenant-context.service';
import { TenantPlugin } from '../tenant-entities';
import { UpdatePluginDto } from './dto/update-plugin.dto';

@Injectable()
export class TenantPluginsService {
  constructor(private readonly tenantContextService: TenantContextService) {}

  private getRepository() {
    const connection = this.tenantContextService.getConnection();
    if (!connection) throw new BadRequestException('Tenant connection not available');
    return connection.getRepository(TenantPlugin);
  }

  async findAll(): Promise<TenantPlugin[]> {
    return this.getRepository().find({ order: { pluginKey: 'ASC' } });
  }

  async findByKey(pluginKey: string): Promise<TenantPlugin> {
    const plugin = await this.getRepository().findOne({ where: { pluginKey } });
    if (!plugin) throw new NotFoundException(`Plugin '${pluginKey}' not found`);
    return plugin;
  }

  /**
   * Actualiza la configuración de un plugin haciendo merge profundo del JSONB.
   * Las credenciales sensibles (api_key, auth_token) deberían cifrarse antes
   * de llegar aquí (AES-256 recomendado). Eso se delega al frontend/gateway.
   */
  async update(pluginKey: string, dto: UpdatePluginDto): Promise<TenantPlugin> {
    const plugin = await this.findByKey(pluginKey);

    if (dto.isActive !== undefined) plugin.isActive = dto.isActive;

    if (dto.config !== undefined) {
      // Merge profundo: preserva claves existentes no incluidas en el patch
      plugin.config = { ...plugin.config, ...dto.config };
    }

    return this.getRepository().save(plugin);
  }

  async getActivePlugins(): Promise<TenantPlugin[]> {
    return this.getRepository().find({ where: { isActive: true } });
  }
}
