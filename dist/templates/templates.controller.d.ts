import type { Response } from 'express';
import { TemplatesService } from './templates.service';
export declare class TemplatesController {
    private readonly templatesService;
    constructor(templatesService: TemplatesService);
    getAllTemplates(): Promise<{
        success: boolean;
        templates: {
            id: number;
            name: string;
            price: number;
            preview: string;
        }[];
    }>;
    getTemplateById(id: number): Promise<{
        success: boolean;
        template: {
            id: number;
            name: string;
            price: number;
            structure: any;
        };
    }>;
    personalizeTemplate(body: {
        hostnameId: number;
        userId: number;
        templateId: number;
        customData: any;
    }): Promise<{
        success: boolean;
        message: string;
        personalization: {
            id: number;
            hostname_id: number;
            template_id: number;
        };
    }>;
    getPersonalization(hostnameId: number, userId: number): Promise<{
        success: boolean;
        message: string;
        personalization?: undefined;
    } | {
        success: boolean;
        personalization: {
            id: number;
            hostname_id: number;
            template_id: number;
            customData: any;
        };
        message?: undefined;
    }>;
}
export declare class SiteController {
    private readonly templatesService;
    constructor(templatesService: TemplatesService);
    renderSite(hostname: string, res: Response): Promise<void>;
}
