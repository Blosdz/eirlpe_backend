import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { HostnamesService } from '../hostnames/hostnames.service';
import { User, UserProfile } from '../entities';
export declare class AuthService {
    private userRepository;
    private userProfileRepository;
    private hostnamesService;
    private jwtService;
    constructor(userRepository: Repository<User>, userProfileRepository: Repository<UserProfile>, hostnamesService: HostnamesService, jwtService: JwtService);
    register(createUserDto: CreateUserDto): Promise<{
        success: boolean;
        message: string;
        access_token: string;
        user: {
            id: number;
            email: string;
            role: string;
            name: string | undefined;
            userProfile: {
                document: string | undefined;
                phone: string | undefined;
                company_name: string | undefined;
                hostname_id: number;
                hostname: string;
            };
        };
    } | {
        success: boolean;
        message: string;
        access_token: string;
        user: {
            id: number;
            email: string;
            role: string;
            name: string | undefined;
            userProfile?: undefined;
        };
    }>;
    login(email: string, password: string): Promise<{
        success: boolean;
        access_token: string;
        user: {
            id: number;
            email: string;
            role: string;
            name: string | undefined;
            userProfile: UserProfile | null;
        };
    }>;
    getProfile(userId: number): Promise<{
        id: number;
        email: string;
        name: string | undefined;
        role: string;
        profile: {
            id: number;
            company_name: string | undefined;
            document: string | undefined;
            phone: string | undefined;
            address: string | undefined;
            ruc_company: string | undefined;
            hostname: string;
        } | {
            company_name: string | undefined;
            document: string | undefined;
            phone: string | undefined;
            address: string | undefined;
            ruc_company: string | undefined;
            id?: undefined;
            hostname?: undefined;
        };
    } | null>;
    updateProfile(userId: number, dto: {
        name?: string;
        email?: string;
        currentPassword?: string;
        newPassword?: string;
        company_name?: string;
        document?: string;
        phone?: string;
        address?: string;
        ruc_company?: string;
    }): Promise<{
        id: number;
        email: string;
        name: string | undefined;
        role: string;
        profile: {
            id: number;
            company_name: string | undefined;
            document: string | undefined;
            phone: string | undefined;
            address: string | undefined;
            ruc_company: string | undefined;
            hostname: string;
        } | {
            company_name: string | undefined;
            document: string | undefined;
            phone: string | undefined;
            address: string | undefined;
            ruc_company: string | undefined;
            id?: undefined;
            hostname?: undefined;
        };
    } | null>;
    getUserHostnames(userId: number): Promise<{
        id: number;
        hostname: string;
        created_at: Date;
        company_name: string | undefined;
        document: string | undefined;
        phone: string | undefined;
    }[]>;
}
