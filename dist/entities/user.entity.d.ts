import { UserProfile } from './user-profile.entity';
import { Cobro } from '../entities/cobro.entity';
import { TemplateUserPersonalization } from './template-user-personalization.entity';
export declare class User {
    id: number;
    email: string;
    password: string;
    created_at: Date;
    updated_at: Date;
    userProfiles: UserProfile[];
    cobros: Cobro[];
    templateUserPersonalizations: TemplateUserPersonalization[];
}
