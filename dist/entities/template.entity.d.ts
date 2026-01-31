import { TemplateUserPersonalization } from './template-user-personalization.entity';
export declare class Template {
    id: number;
    template_json: string;
    folder_template: string;
    prices_stimation: number;
    created_at: Date;
    updated_at: Date;
    templateUserPersonalizations: TemplateUserPersonalization[];
}
