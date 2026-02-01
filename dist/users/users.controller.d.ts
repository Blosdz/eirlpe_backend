import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<import("../entities").User[]>;
    findOne(id: number): Promise<import("../entities").User>;
    remove(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
}
