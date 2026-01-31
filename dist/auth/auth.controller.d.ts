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
    login(body: {
        email: string;
        password: string;
    }): Promise<{
        success: boolean;
        access_token: string;
        user: {
            id: any;
            email: any;
            userProfile: any;
        };
    }>;
    getUserHostnames(userId: number): Promise<any>;
    getProfile(req: any): Promise<{
        success: boolean;
        user: any;
    }>;
}
