import { UserProfile } from './user-profile.entity';
import { Available } from './available.entity';
export declare class User {
    id: number;
    email: string;
    name: string | null;
    companyName: string | null;
    document: string | null;
    phone: string | null;
    address: string | null;
    rucCompany: string | null;
    password: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
    userProfiles: UserProfile[];
    availables: Available[];
}
