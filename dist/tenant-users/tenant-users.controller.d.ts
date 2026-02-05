import { TenantUsersService } from './tenant-users.service';
import { CreateTenantUserDto } from './dto/create-tenant-user.dto';
import { LoginTenantUserDto } from './dto/login-tenant-user.dto';
export declare class TenantUsersController {
    private readonly usersService;
    constructor(usersService: TenantUsersService);
    register(dto: CreateTenantUserDto): Promise<{
        user: Partial<import("../tenant-entities").TenantUser>;
        access_token: string;
    }>;
    login(dto: LoginTenantUserDto): Promise<{
        user: Partial<import("../tenant-entities").TenantUser>;
        access_token: string;
    }>;
    getProfile(user: any): Promise<{
        success: boolean;
        user: {
            id: any;
            mail: any;
            name: any;
            role: any;
            tenantId: any;
            hostname: any;
        };
    }>;
    findAll(role: string): Promise<Partial<import("../tenant-entities").TenantUser>[] | {
        success: boolean;
        message: string;
    }>;
    findOne(id: number, role: string): Promise<{
        success: boolean;
        message: string;
        id?: undefined;
        mail?: undefined;
        name?: undefined;
        role?: undefined;
        status?: undefined;
        createdAt?: undefined;
        lastLoginAt?: undefined;
    } | {
        id: number;
        mail: string;
        name: string;
        role: string;
        status: string;
        createdAt: Date;
        lastLoginAt: Date;
        success?: undefined;
        message?: undefined;
    }>;
    updateStatus(id: number, status: string, role: string): Promise<import("../tenant-entities").TenantUser | {
        success: boolean;
        message: string;
    }>;
    updateRole(id: number, newRole: string, role: string): Promise<import("../tenant-entities").TenantUser | {
        success: boolean;
        message: string;
    }>;
}
