import {
  Controller,
  Get,
  Param,
  Res,
  BadRequestException,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import * as express from 'express';
import { TemplateRendererService } from './template-renderer.service';
import { TenantContextService } from '../tenant/tenant-context.service';
import { TenantConfig } from '../tenant-entities';
import { TenantGuard } from '../tenant/guards/tenant.guard';
import { RequireTenant } from '../tenant/decorators/require-tenant.decorator';

// Tipos MIME para los assets estáticos de los templates
const MIME: Record<string, string> = {
  css: 'text/css; charset=utf-8',
  js:  'application/javascript; charset=utf-8',
};

@Controller('tenant-page')
export class TenantPageController {
  constructor(
    private readonly renderer: TemplateRendererService,
    private readonly tenantCtx: TenantContextService,
  ) {}

  // ──────────────────────────────────────────────────────────────────────────
  // GET /api/tenant-page
  // Renderiza y sirve la landing page del tenant con su customización actual.
  // Requiere x-tenant-host — el browser lo envía desde el frontend via fetch.
  // ──────────────────────────────────────────────────────────────────────────
  @Get()
  @RequireTenant()
  @UseGuards(TenantGuard)
  async renderPage(@Res() res: express.Response) {
    const config = await this.getConfig();

    const templateId = config?.templateId;
    if (!templateId) {
      throw new BadRequestException(
        'Este tenant no tiene un template configurado. Configúralo en PUT /api/tenant-config',
      );
    }

    if (!this.renderer.templateExists(templateId)) {
      throw new NotFoundException(`Template '${templateId}' no existe en el servidor`);
    }

    const customization = (config.customization ?? {}) as Record<string, string>;
    const hostname = this.tenantCtx.getHostname();

    // La URL base para CSS/JS del template (reescritura de rutas)
    const assetBaseUrl = `/api/tenant-page/assets/${templateId}`;

    const html = this.renderer.render(templateId, customization, assetBaseUrl);

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('X-Tenant', hostname ?? '');
    res.setHeader('Cache-Control', 'no-cache'); // editor siempre ve cambios frescos
    res.send(html);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // GET /api/tenant-page/assets/:templateId/:filename
  // Sirve los archivos estáticos del template (styles.css, script.js).
  // ──────────────────────────────────────────────────────────────────────────
  @Get('assets/:templateId/:filename')
  serveAsset(
    @Param('templateId') templateId: string,
    @Param('filename') filename: string,
    @Res() res: express.Response,
  ) {
    const ext = filename.split('.').pop()?.toLowerCase() ?? '';
    if (!['css', 'js'].includes(ext)) {
      throw new BadRequestException('Solo se sirven archivos .css y .js');
    }

    const content = this.renderer.readAsset(templateId, filename);
    const mime = MIME[ext] ?? 'text/plain';

    res.setHeader('Content-Type', mime);
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(content);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // GET /api/tenant-page/templates
  // Lista todos los templates con metadata (name, description, category) para el selector.
  // ──────────────────────────────────────────────────────────────────────────
  @Get('templates')
  listTemplates() {
    return { templates: this.renderer.listTemplatesWithMeta() };
  }

  // ──────────────────────────────────────────────────────────────────────────
  // GET /api/tenant-page/preview/:templateId
  // Devuelve el HTML del template con valores por defecto para preview (iframe en el selector).
  // Público, no requiere tenant.
  // ──────────────────────────────────────────────────────────────────────────
  @Get('preview/:templateId')
  previewTemplate(
    @Param('templateId') templateId: string,
    @Res() res: express.Response,
  ) {
    if (!this.renderer.templateExists(templateId)) {
      throw new NotFoundException(`Template '${templateId}' no existe`);
    }
    const assetBaseUrl = `/api/tenant-page/assets/${templateId}`;
    const html = this.renderer.renderPreview(templateId, assetBaseUrl);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.send(html);
  }

  // ── helper ─────────────────────────────────────────────────────────────────

  private async getConfig(): Promise<TenantConfig | null> {
    const connection = this.tenantCtx.getConnection();
    if (!connection) return null;
    const repo = connection.getRepository(TenantConfig);
    return repo.findOne({ where: { isActive: true } });
  }
}
