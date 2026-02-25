import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { TenantPluginsService } from './tenant-plugins.service';
import { UpdatePluginDto } from './dto/update-plugin.dto';
import { TenantGuard } from '../tenant/guards/tenant.guard';
import { RequireTenant } from '../tenant/decorators/require-tenant.decorator';
import { TenantJwtAuthGuard } from '../tenant-users/guards/tenant-jwt-auth.guard';

@Controller('tenant-plugins')
@RequireTenant()
@UseGuards(TenantGuard)
export class TenantPluginsController {
  constructor(private readonly service: TenantPluginsService) {}

  /** Público: el frontend puede saber qué plugins están activos para renderizar el chatbot, etc. */
  @Get('active')
  getActive() {
    return this.service.getActivePlugins();
  }

  /** Admin: ver todos los plugins y su configuración */
  @Get()
  @UseGuards(TenantJwtAuthGuard)
  findAll() {
    return this.service.findAll();
  }

  @Get(':key')
  @UseGuards(TenantJwtAuthGuard)
  findOne(@Param('key') key: string) {
    return this.service.findByKey(key);
  }

  /** Admin: actualizar config/estado de un plugin */
  @Patch(':key')
  @UseGuards(TenantJwtAuthGuard)
  update(@Param('key') key: string, @Body() dto: UpdatePluginDto) {
    return this.service.update(key, dto);
  }
}
