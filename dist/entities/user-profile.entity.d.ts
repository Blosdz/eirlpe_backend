import { User } from './user.entity';
import { Hostname } from './hostname.entity';
import { TemplateUserPersonalization } from './template-user-personalization.entity';
export declare class UserProfile {
    id: number;
    users_id: number;
    document: string;
    phone: string;
    company_name: string;
    hostname_id: number;
    template_user_id: number;
    created_at: Date;
    updated_at: Date;
    user: User;
    hostname: Hostname;
    templateUserPersonalization: TemplateUserPersonalization;
}
