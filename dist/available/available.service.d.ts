import { Repository } from 'typeorm';
import { Available } from '../entities';
export declare class AvailableService {
    private availableRepository;
    constructor(availableRepository: Repository<Available>);
    findAll(): Promise<Available[]>;
    findOne(id: number): Promise<Available>;
    findByUserId(userId: number): Promise<Available | null>;
    checkUserAvailability(userId: number): Promise<{
        available: boolean;
        userId: number;
    }>;
    setAvailability(userId: number, available: boolean): Promise<Available>;
    remove(id: number): Promise<void>;
}
