import { Strategy } from 'passport-jwt';
import { DataSource } from 'typeorm';
export interface JwtPayload {
    sub: number;
    email: string;
}
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private dataSource;
    constructor(dataSource: DataSource);
    validate(payload: JwtPayload): Promise<{
        id: any;
        email: any;
        userProfile: any;
    }>;
}
export {};
