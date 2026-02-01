import { UserProfileService } from './user-profile.service';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
export declare class UserProfileController {
    private readonly userProfileService;
    constructor(userProfileService: UserProfileService);
    findAll(): Promise<import("../entities").UserProfile[]>;
    getMyProfiles(req: any): Promise<import("../entities").UserProfile[]>;
    findOne(id: number): Promise<import("../entities").UserProfile>;
    findByUserId(userId: number): Promise<import("../entities").UserProfile[]>;
    findByHostnameId(hostnameId: number): Promise<import("../entities").UserProfile[]>;
    update(id: number, updateDto: UpdateUserProfileDto): Promise<import("../entities").UserProfile>;
    remove(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
}
