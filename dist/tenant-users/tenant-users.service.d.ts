import { JwtService } from '@nestjs/jwt';
import { TenantContextService } from '../tenant/tenant-context.service';
import { TenantUser } from '../tenant-entities';
import { CreateTenantUserDto } from './dto/create-tenant-user.dto';
import { LoginTenantUserDto } from './dto/login-tenant-user.dto';
export interface TenantJwtPayload {
    sub: number;
    mail: string;
    tenantId: number;
    hostname: string;
    type: 'tenant_user';
}
export declare class TenantUsersService {
    private readonly tenantContextService;
    private readonly jwtService;
    constructor(tenantContextService: TenantContextService, jwtService: JwtService);
    private getRepository;
    register(dto: CreateTenantUserDto): Promise<{
        user: Partial<TenantUser>;
        access_token: string;
    }>;
    login(dto: LoginTenantUserDto): Promise<{
        user: Partial<TenantUser>;
        access_token: string;
    }>;
    findAll(): Promise<Partial<TenantUser>[]>;
    findById(id: number): Promise<TenantUser>;
    findByMail(mail: string): Promise<TenantUser | null>;
    updateStatus(id: number, status: string): Promise<TenantUser>;
    updateRole(id: number, role: string): Promise<TenantUser>;
}
