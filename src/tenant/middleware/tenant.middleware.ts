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

/**
 * Extrae el subdomain de un valor que puede venir como:
 *   "test"                   → "test"
 *   "test.localhost"         → "test"
 *   "test.localhost:3000"    → "test"
 *   "test.midominio.com"     → "test"
 */
function extractSubdomain(raw: string): string {
  // Quitar puerto si existe
  const withoutPort = raw.split(':')[0];
  // Tomar la parte antes del primer punto
  return withoutPort.split('.')[0].toLowerCase().trim();
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
    const raw = (req.headers[TENANT_HEADER] as string) || (req.query.tenant as string);

    if (!raw) {
      return next();
    }

    // Normaliza: "test.localhost:3000" → "test", "test.midominio.com" → "test"
    // Si no tiene punto, se usa tal cual (ya es el subdomain/hostname directo)
    const hostname = extractSubdomain(raw);

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
