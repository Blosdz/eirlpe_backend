import { Module, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { HostnamesModule } from './hostnames/hostnames.module';
import { UserProfileModule } from './user-profile/user-profile.module';
import { AvailableModule } from './available/available.module';
import { TenantModule } from './tenant/tenant.module';
import { TenantMiddleware } from './tenant/middleware/tenant.middleware';
import { TenantContactsModule } from './tenant-contacts/tenant-contacts.module';
import { TenantUsersModule } from './tenant-users/tenant-users.module';
import { TenantConfigModule } from './tenant-config/tenant-config.module';
import { TenantPluginsModule } from './tenant-plugins/tenant-plugins.module';
import { TenantPageModule } from './tenant-page/tenant-page.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'eirl',
      schema: process.env.DB_SCHEMA || 'eirl',
      entities: [__dirname + '/entities/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV === 'development',
      logging: process.env.NODE_ENV === 'development',
    }),
    TenantModule,
    TenantContactsModule,
    TenantUsersModule,
    TenantConfigModule,
    TenantPluginsModule,
    TenantPageModule,
    AuthModule,
    UsersModule,
    HostnamesModule,
    UserProfileModule,
    AvailableModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
