import { Hostname } from './hostname.entity';
import { User } from './user.entity';
import { Template } from './template.entity';
import { UserProfile } from './user-profile.entity';
export declare class TemplateUserPersonalization {
    id: number;
    hostname_id: number;
    user_id: number;
    template_id: number;
    template_json_personalization: string;
    cobros_available: boolean;
    created_at: Date;
    updated_at: Date;
    hostname: Hostname;
    user: User;
    template: Template;
    userProfiles: UserProfile[];
}
