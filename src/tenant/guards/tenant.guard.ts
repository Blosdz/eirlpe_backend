import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUIRE_TENANT_KEY } from '../decorators/require-tenant.decorator';
import { TENANT_HEADER } from '../tenant.constants';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requireTenant = this.reflector.getAllAndOverride<boolean>(
      REQUIRE_TENANT_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (requireTenant === undefined || requireTenant === false) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const tenant = request.tenant;

    if (!tenant || !tenant.tenantId) {
      throw new BadRequestException(
        `Tenant required. Include the header ${TENANT_HEADER} with a valid hostname.`,
      );
    }

    return true;
  }
}
