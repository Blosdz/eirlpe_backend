import { User } from './user.entity';
export declare class Cobro {
    id: number;
    user_id: number;
    template_price_stimation: number;
    available: boolean;
    created_at: Date;
    updated_at: Date;
    user: User;
}
