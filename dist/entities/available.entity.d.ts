import { User } from './user.entity';
export declare class Available {
    id: number;
    userId: number;
    available: boolean;
    createdAt: Date;
    updatedAt: Date;
    user: User;
}
