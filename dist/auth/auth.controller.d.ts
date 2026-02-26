import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    login(body: {
        email: string;
        password: string;
    }): Promise<{
        success: boolean;
        access_token: string;
        user: {
            id: number;
            email: string;
            role: string;
            userProfile: import("../entities").UserProfile | null;
        };
    }>;
    getUserHostnames(userId: number): Promise<{
        id: number;
        hostname: string;
        created_at: Date;
        company_name: string | undefined;
        document: string | undefined;
        phone: string | undefined;
    }[]>;
    getProfile(req: any): Promise<{
        success: boolean;
        user: any;
    }>;
}
