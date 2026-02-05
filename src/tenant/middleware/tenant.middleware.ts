import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AsyncLocalStorage } from 'async_hooks';
import { TenantService } from '../tenant.service';
import { TenantConnectionService } from '../tenant-connection.service';
import { TENANT_CONTEXT, TENANT_HEADER } from '../tenant.constants';
import { TenantContext } from '../interfaces/tenant-context.interface';

declare global {
  namespace Express {
    interface Request {
      tenant?: TenantContext;
    }
  }
}

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(
    private readonly tenantService: TenantService,
    private readonly tenantConnectionService: TenantConnectionService,
    @Inject(TENANT_CONTEXT)
    private readonly asyncLocalStorage: AsyncLocalStorage<TenantContext>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const hostname = req.headers[TENANT_HEADER] as string;

    if (!hostname) {
      return next();
    }

    const tenant = await this.tenantService.resolveHostname(hostname);

    if (!tenant) {
      return next();
    }

    try {
      const connection = await this.tenantConnectionService.getConnection(hostname);

      const tenantContext: TenantContext = {
        tenantId: tenant.id,
        hostname: tenant.hostname,
        connection,
        resolvedAt: new Date(),
      };

      req.tenant = tenantContext;

      this.asyncLocalStorage.run(tenantContext, () => {
        next();
      });
    } catch (error) {
      return next();
    }
  }
}
