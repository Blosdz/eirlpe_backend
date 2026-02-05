import { Injectable, Inject } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { DataSource } from 'typeorm';
import { TENANT_CONTEXT } from './tenant.constants';
import { TenantContext } from './interfaces/tenant-context.interface';

@Injectable()
export class TenantContextService {
  constructor(
    @Inject(TENANT_CONTEXT)
    private readonly asyncLocalStorage: AsyncLocalStorage<TenantContext>,
  ) {}

  getTenantContext(): TenantContext | undefined {
    return this.asyncLocalStorage.getStore();
  }

  getTenantId(): number | undefined {
    return this.asyncLocalStorage.getStore()?.tenantId;
  }

  getHostname(): string | undefined {
    return this.asyncLocalStorage.getStore()?.hostname;
  }

  getConnection(): DataSource | undefined {
    return this.asyncLocalStorage.getStore()?.connection;
  }

  run<T>(context: TenantContext, callback: () => T): T {
    return this.asyncLocalStorage.run(context, callback);
  }

  runAsync<T>(context: TenantContext, callback: () => Promise<T>): Promise<T> {
    return this.asyncLocalStorage.run(context, callback);
  }
}
