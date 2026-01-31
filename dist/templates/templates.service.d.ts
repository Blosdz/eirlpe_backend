import { Repository } from 'typeorm';
import { Template } from '../entities/template.entity';
import { Hostname } from '../entities/hostname.entity';
import { TemplateUserPersonalization } from '../entities/template-user-personalization.entity';
export declare class TemplatesService {
    private templateRepository;
    private hostnameRepository;
    private templateUserPersonalizationRepository;
    constructor(templateRepository: Repository<Template>, hostnameRepository: Repository<Hostname>, templateUserPersonalizationRepository: Repository<TemplateUserPersonalization>);
    private registerHandlebarsHelpers;
    findAll(): Promise<Template[]>;
    findById(id: number): Promise<Template>;
    renderTemplate(hostname: string): Promise<string>;
    createPersonalization(hostnameId: number, userId: number, templateId: number, customData: any): Promise<TemplateUserPersonalization>;
    getPersonalization(hostnameId: number, userId: number): Promise<TemplateUserPersonalization | null>;
    private mergeTemplateData;
}
