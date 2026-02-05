import { AsyncLocalStorage } from 'async_hooks';
import { DataSource } from 'typeorm';
import { TenantContext } from './interfaces/tenant-context.interface';
export declare class TenantContextService {
    private readonly asyncLocalStorage;
    constructor(asyncLocalStorage: AsyncLocalStorage<TenantContext>);
    getTenantContext(): TenantContext | undefined;
    getTenantId(): number | undefined;
    getHostname(): string | undefined;
    getConnection(): DataSource | undefined;
    run<T>(context: TenantContext, callback: () => T): T;
    runAsync<T>(context: TenantContext, callback: () => Promise<T>): Promise<T>;
}
