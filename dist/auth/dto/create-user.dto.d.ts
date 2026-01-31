declare class UserProfileDto {
    document?: string;
    phone?: string;
    company_name?: string;
    hostname_id: string;
}
export declare class CreateUserDto {
    email: string;
    password: string;
    name: string;
    userProfile: UserProfileDto;
}
export {};
