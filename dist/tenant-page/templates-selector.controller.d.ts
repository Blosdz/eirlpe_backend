import * as express from 'express';
import { TemplateRendererService } from './template-renderer.service';
export declare class TemplatesSelectorController {
    private readonly renderer;
    constructor(renderer: TemplateRendererService);
    list(): {
        templates: {
            id: string;
            name: string;
            description: string;
            category: string;
        }[];
    };
    preview(id: string, res: express.Response): void;
    previewAsset(id: string, filename: string, res: express.Response): express.Response<any, Record<string, any>> | undefined;
}
