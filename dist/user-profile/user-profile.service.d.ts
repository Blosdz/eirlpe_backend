import { Repository } from 'typeorm';
import { UserProfile } from '../entities';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
export declare class UserProfileService {
    private userProfileRepository;
    constructor(userProfileRepository: Repository<UserProfile>);
    findAll(): Promise<UserProfile[]>;
    findOne(id: number): Promise<UserProfile>;
    findByUserId(userId: number): Promise<UserProfile[]>;
    findByHostnameId(hostnameId: number): Promise<UserProfile[]>;
    update(id: number, updateDto: UpdateUserProfileDto): Promise<UserProfile>;
    remove(id: number): Promise<void>;
}
