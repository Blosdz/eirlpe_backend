import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { HostnamesService } from '../hostnames/hostnames.service';
export declare class AuthService {
    private dataSource;
    private hostnamesService;
    private jwtService;
    constructor(dataSource: DataSource, hostnamesService: HostnamesService, jwtService: JwtService);
    register(createUserDto: CreateUserDto): Promise<{
        success: boolean;
        message: string;
        access_token: string;
        user: {
            id: any;
            email: string;
            name: string;
            userProfile: {
                document: string | null;
                phone: string | null;
                company_name: string | null;
                hostname_id: number;
                hostname: string;
            };
        };
    }>;
    login(email: string, password: string): Promise<{
        success: boolean;
        access_token: string;
        user: {
            id: any;
            email: any;
            userProfile: any;
        };
    }>;
    getUserHostnames(userId: number): Promise<any>;
}
