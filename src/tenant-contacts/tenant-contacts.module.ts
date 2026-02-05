import { Module } from '@nestjs/common';
import { TenantContactsService } from './tenant-contacts.service';
import { TenantContactsController } from './tenant-contacts.controller';

@Module({
  controllers: [TenantContactsController],
  providers: [TenantContactsService],
  exports: [TenantContactsService],
})
export class TenantContactsModule {}
