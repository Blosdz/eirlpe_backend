import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TenantConnectionService } from '../../tenant/tenant-connection.service';
import { TenantUser } from '../../tenant-entities';
import { TenantJwtPayload } from '../tenant-users.service';

@Injectable()
export class TenantJwtStrategy extends PassportStrategy(Strategy, 'tenant-jwt') {
  constructor(
    private configService: ConfigService,
    private tenantConnectionService: TenantConnectionService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('TENANT_JWT_SECRET', 'tenant-secret-key-2026'),
    });
  }

  async validate(payload: TenantJwtPayload) {
    if (payload.type !== 'tenant_user') {
      throw new UnauthorizedException('Invalid token type');
    }

    const connection = await this.tenantConnectionService.getConnection(payload.hostname);
    const repository = connection.getRepository(TenantUser);

    const user = await repository.findOne({
      where: { id: payload.sub },
    });

    if (!user || user.status !== 'active') {
      throw new UnauthorizedException('User not found or inactive');
    }

    return {
      id: user.id,
      mail: user.mail,
      name: user.name,
      tenantId: payload.tenantId,
      hostname: payload.hostname,
      role: user.role,
      type: 'tenant_user',
    };
  }
}
