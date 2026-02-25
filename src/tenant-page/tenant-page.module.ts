import { Module } from '@nestjs/common';
import { TemplateRendererService } from './template-renderer.service';
import { TenantPageController } from './tenant-page.controller';

@Module({
  controllers: [TenantPageController],
  providers: [TemplateRendererService],
  exports: [TemplateRendererService],
})
export class TenantPageModule {}
