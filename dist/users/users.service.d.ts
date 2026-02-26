import { Repository } from 'typeorm';
import { User } from '../entities';
export declare class UsersService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    findAll(): Promise<User[]>;
    findOne(id: number): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    update(id: number, updateUserDto: Partial<User>): Promise<User>;
    remove(id: number): Promise<void>;
}
