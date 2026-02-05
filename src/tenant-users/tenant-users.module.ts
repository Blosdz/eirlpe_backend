import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { TenantUsersService } from './tenant-users.service';
import { TenantUsersController } from './tenant-users.controller';
import { TenantJwtStrategy } from './strategies/tenant-jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('TENANT_JWT_SECRET', 'tenant-secret-key-2026'),
        signOptions: {
          expiresIn: configService.get('TENANT_JWT_EXPIRES_IN', '8h'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [TenantUsersController],
  providers: [TenantUsersService, TenantJwtStrategy],
  exports: [TenantUsersService],
})
export class TenantUsersModule {}
