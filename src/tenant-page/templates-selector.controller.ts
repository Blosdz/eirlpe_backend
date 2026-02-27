import { Controller, Get, Param, Res, NotFoundException } from '@nestjs/common';
import * as express from 'express';
import { TemplateRendererService } from './template-renderer.service';

/**
 * Rutas públicas para el selector de templates en el frontend (sin tenant).
 * GET /api/templates-selector         -> lista con metadata
 * GET /api/templates-selector/preview/:id -> HTML de preview
 */
@Controller('templates-selector')
export class TemplatesSelectorController {
  constructor(private readonly renderer: TemplateRendererService) {}

  @Get()
  list() {
    return { templates: this.renderer.listTemplatesWithMeta() };
  }

  @Get('preview/:id')
  preview(@Param('id') id: string, @Res() res: express.Response) {
    if (!this.renderer.templateExists(id)) {
      throw new NotFoundException(`Template '${id}' no existe`);
    }
    const assetBaseUrl = `/api/templates-selector/preview/${id}/assets`;
    const html = this.renderer.renderPreview(id, assetBaseUrl);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.send(html);
  }

  /**
   * Assets del template para el preview (CSS/JS). Ruta usada por el HTML generado en preview/:id.
   * GET /api/templates-selector/preview/:id/assets/styles.css
   */
  @Get('preview/:id/assets/:filename')
  previewAsset(
    @Param('id') id: string,
    @Param('filename') filename: string,
    @Res() res: express.Response,
  ) {
    const ext = filename.split('.').pop()?.toLowerCase() ?? '';
    if (!['css', 'js'].includes(ext)) {
      return res.status(400).send('Solo .css y .js');
    }
    const content = this.renderer.readAsset(id, filename);
    const mime = ext === 'css' ? 'text/css; charset=utf-8' : 'application/javascript; charset=utf-8';
    res.setHeader('Content-Type', mime);
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(content);
  }
}
