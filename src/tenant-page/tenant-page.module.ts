import { Module } from '@nestjs/common';
import { TemplateRendererService } from './template-renderer.service';
import { TenantPageController } from './tenant-page.controller';
import { TemplatesSelectorController } from './templates-selector.controller';

@Module({
  controllers: [TenantPageController, TemplatesSelectorController],
  providers: [TemplateRendererService],
  exports: [TemplateRendererService],
})
export class TenantPageModule {}
