import { UserProfile } from './user-profile.entity';
import { Available } from './available.entity';
export declare class User {
    id: number;
    email: string;
    password: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
    userProfiles: UserProfile[];
    availables: Available[];
}
