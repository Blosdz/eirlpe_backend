import { UserProfile } from './user-profile.entity';
export declare class Hostname {
    id: number;
    hostname: string;
    createdAt: Date;
    updatedAt: Date;
    userProfiles: UserProfile[];
}
