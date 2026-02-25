import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { TenantConfigService } from './tenant-config.service';
import { UpsertTenantConfigDto } from './dto/upsert-tenant-config.dto';
import { TenantGuard } from '../tenant/guards/tenant.guard';
import { RequireTenant } from '../tenant/decorators/require-tenant.decorator';
import { TenantJwtAuthGuard } from '../tenant-users/guards/tenant-jwt-auth.guard';
import { MARKERS_META, MARKER_DEFAULTS } from '../tenant-page/template-renderer.service';

@Controller('tenant-config')
@RequireTenant()
@UseGuards(TenantGuard)
export class TenantConfigController {
  constructor(private readonly service: TenantConfigService) {}

  // ──────────────────────────────────────────────────────────────────────────
  // GET /api/tenant-config
  // Config completa del tenant (para consumo interno / admin)
  // ──────────────────────────────────────────────────────────────────────────
  @Get()
  getConfig() {
    return this.service.getConfig();
  }

  // ──────────────────────────────────────────────────────────────────────────
  // GET /api/tenant-config/editor-data
  // Devuelve los datos que necesita el editor para renderizar sus campos:
  //   - templateId actual
  //   - fields: lista de marcadores con metadatos + el valor actual del tenant
  //             (si no hay valor guardado, usa el default)
  // ──────────────────────────────────────────────────────────────────────────
  @Get('editor-data')
  @UseGuards(TenantJwtAuthGuard)
  async getEditorData() {
    let config: { templateId?: string; customization?: Record<string, unknown> } | null = null;

    try {
      config = await this.service.getConfig();
    } catch {
      // El tenant aún no tiene config — devolvemos los defaults
    }

    const saved = (config?.customization ?? {}) as Record<string, string>;

    // Para cada marcador, devolver: metadatos + valor actual (saved > default)
    const fields = MARKERS_META.map((meta) => ({
      key:          meta.key,
      label:        meta.label,
      group:        meta.group,
      hint:         meta.hint ?? null,
      defaultValue: meta.defaultValue,
      currentValue: saved[meta.key] ?? MARKER_DEFAULTS[meta.key] ?? meta.defaultValue,
    }));

    return {
      templateId:   config?.templateId ?? null,
      fields,
    };
  }

  // ──────────────────────────────────────────────────────────────────────────
  // PUT /api/tenant-config
  // Guarda / actualiza la config del tenant.
  // Body: { templateId, businessName?, customization?, isActive? }
  // donde customization es un objeto plano: { "TITULO_PRINCIPAL": "...", ... }
  // ──────────────────────────────────────────────────────────────────────────
  @Put()
  @UseGuards(TenantJwtAuthGuard)
  upsert(@Body() dto: UpsertTenantConfigDto) {
    return this.service.upsert(dto);
  }
}
