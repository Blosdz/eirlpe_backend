import { Module } from '@nestjs/common';
import { TenantPluginsService } from './tenant-plugins.service';
import { TenantPluginsController } from './tenant-plugins.controller';

@Module({
  controllers: [TenantPluginsController],
  providers: [TenantPluginsService],
  exports: [TenantPluginsService],
})
export class TenantPluginsModule {}
