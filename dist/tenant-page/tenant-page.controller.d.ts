import * as express from 'express';
import { TemplateRendererService } from './template-renderer.service';
import { TenantContextService } from '../tenant/tenant-context.service';
export declare class TenantPageController {
    private readonly renderer;
    private readonly tenantCtx;
    constructor(renderer: TemplateRendererService, tenantCtx: TenantContextService);
    renderPage(res: express.Response): Promise<void>;
    serveAsset(templateId: string, filename: string, res: express.Response): void;
    listTemplates(): {
        templates: {
            id: string;
            name: string;
            description: string;
            category: string;
        }[];
    };
    previewTemplate(templateId: string, res: express.Response): void;
    private getConfig;
}
