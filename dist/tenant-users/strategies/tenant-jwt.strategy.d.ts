import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { TenantConnectionService } from '../../tenant/tenant-connection.service';
import { TenantJwtPayload } from '../tenant-users.service';
declare const TenantJwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class TenantJwtStrategy extends TenantJwtStrategy_base {
    private configService;
    private tenantConnectionService;
    constructor(configService: ConfigService, tenantConnectionService: TenantConnectionService);
    validate(payload: TenantJwtPayload): Promise<{
        id: number;
        mail: string;
        name: string;
        tenantId: number;
        hostname: string;
        role: string;
        type: string;
    }>;
}
export {};
