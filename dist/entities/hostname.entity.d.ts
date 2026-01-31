import { UserProfile } from './user-profile.entity';
import { TemplateUserPersonalization } from '../entities/template-user-personalization.entity';
export declare class Hostname {
    id: number;
    hostname: string;
    template_user_personalization: number;
    created_at: Date;
    updated_at: Date;
    userProfiles: UserProfile[];
    templateUserPersonalizations: TemplateUserPersonalization[];
}
