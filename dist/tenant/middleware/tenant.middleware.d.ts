import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AsyncLocalStorage } from 'async_hooks';
import { TenantService } from '../tenant.service';
import { TenantConnectionService } from '../tenant-connection.service';
import { TenantContext } from '../interfaces/tenant-context.interface';
declare global {
    namespace Express {
        interface Request {
            tenant?: TenantContext;
        }
    }
}
export declare class TenantMiddleware implements NestMiddleware {
    private readonly tenantService;
    private readonly tenantConnectionService;
    private readonly asyncLocalStorage;
    constructor(tenantService: TenantService, tenantConnectionService: TenantConnectionService, asyncLocalStorage: AsyncLocalStorage<TenantContext>);
    use(req: Request, res: Response, next: NextFunction): Promise<void>;
}
