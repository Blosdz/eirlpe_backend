import { User } from './user.entity';
import { Hostname } from './hostname.entity';
export declare class UserProfile {
    id: number;
    usersId: number;
    document?: string;
    phone?: string;
    companyName?: string;
    address?: string;
    rucCompany?: string;
    hostnameId: number;
    templateUserId: number;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    hostname: Hostname;
}
