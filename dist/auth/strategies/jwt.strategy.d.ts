import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { User, UserProfile } from '../../entities';
export interface JwtPayload {
    sub: number;
    email: string;
}
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private userRepository;
    private userProfileRepository;
    constructor(configService: ConfigService, userRepository: Repository<User>, userProfileRepository: Repository<UserProfile>);
    validate(payload: JwtPayload): Promise<{
        id: number;
        email: string;
        userProfile: UserProfile | null;
    }>;
}
export {};
