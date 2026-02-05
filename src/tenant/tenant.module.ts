import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AsyncLocalStorage } from 'async_hooks';
import { Hostname } from '../entities';
import { TenantService } from './tenant.service';
import { TenantContextService } from './tenant-context.service';
import { TenantConnectionService } from './tenant-connection.service';
import { TENANT_CONTEXT } from './tenant.constants';
import { TenantContext } from './interfaces/tenant-context.interface';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Hostname])],
  providers: [
    TenantService,
    TenantContextService,
    TenantConnectionService,
    {
      provide: TENANT_CONTEXT,
      useValue: new AsyncLocalStorage<TenantContext>(),
    },
  ],
  exports: [
    TenantService,
    TenantContextService,
    TenantConnectionService,
    TENANT_CONTEXT,
  ],
})
export class TenantModule {}
