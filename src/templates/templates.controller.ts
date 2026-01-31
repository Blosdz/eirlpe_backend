import { Controller, Get, Post, Body, Param, Res, HttpStatus, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { TemplatesService } from './templates.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  /**
   * Get all available templates
   */
  @Get()
  async getAllTemplates() {
    const templates = await this.templatesService.findAll();
    return {
      success: true,
      templates: templates.map((t) => ({
        id: t.id,
        name: t.folder_template,
        price: t.prices_stimation,
        preview: `/templates/${t.folder_template}/preview.jpg`,
      })),
    };
  }

  /**
   * Get template details by ID
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getTemplateById(@Param('id') id: number) {
    const template = await this.templatesService.findById(id);
    return {
      success: true,
      template: {
        id: template.id,
        name: template.folder_template,
        price: template.prices_stimation,
        structure: JSON.parse(template.template_json),
      },
    };
  }

  /**
   * Create or update template personalization
   */
  @UseGuards(JwtAuthGuard)
  @Post('personalize')
  async personalizeTemplate(
    @Body()
    body: {
      hostnameId: number;
      userId: number;
      templateId: number;
      customData: any;
    },
  ) {
    const personalization = await this.templatesService.createPersonalization(
      body.hostnameId,
      body.userId,
      body.templateId,
      body.customData,
    );

    return {
      success: true,
      message: 'Template personalization saved successfully',
      personalization: {
        id: personalization.id,
        hostname_id: personalization.hostname_id,
        template_id: personalization.template_id,
      },
    };
  }

  /**
   * Get template personalization
   */
  @UseGuards(JwtAuthGuard)
  @Get('personalize/:hostnameId/:userId')
  async getPersonalization(
    @Param('hostnameId') hostnameId: number,
    @Param('userId') userId: number,
  ) {
    const personalization = await this.templatesService.getPersonalization(
      hostnameId,
      userId,
    );

    if (!personalization) {
      return {
        success: false,
        message: 'No personalization found',
      };
    }

    return {
      success: true,
      personalization: {
        id: personalization.id,
        hostname_id: personalization.hostname_id,
        template_id: personalization.template_id,
        customData: JSON.parse(personalization.template_json_personalization),
      },
    };
  }
}

/**
 * Site controller - renders the actual websites
 */
@Controller('site')
export class SiteController {
  constructor(private readonly templatesService: TemplatesService) {}

  /**
   * Render site for a hostname
   * Example: /site/miempresa
   */
  @Get(':hostname')
  async renderSite(
    @Param('hostname') hostname: string,
    @Res() res: Response,
  ) {
    try {
      const html = await this.templatesService.renderTemplate(hostname);
      res.status(HttpStatus.OK).send(html);
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Site Not Found</title>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-gray-100 flex items-center justify-center min-h-screen">
          <div class="text-center">
            <h1 class="text-6xl font-bold text-gray-800 mb-4">404</h1>
            <p class="text-2xl text-gray-600 mb-8">Sitio no encontrado</p>
            <p class="text-gray-500">El hostname "${hostname}" no existe o no ha sido configurado.</p>
            <a href="/" class="inline-block mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
              Volver al inicio
            </a>
          </div>
        </body>
        </html>
      `);
    }
  }
}
