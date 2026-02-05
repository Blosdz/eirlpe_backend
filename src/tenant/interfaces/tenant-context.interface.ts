import { DataSource } from 'typeorm';

export interface TenantContext {
  tenantId: number;
  hostname: string;
  connection: DataSource;
  resolvedAt: Date;
}
