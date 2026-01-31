import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemplatesService } from './templates.service';
import { TemplatesController, SiteController } from './templates.controller';
import { Template } from '../entities/template.entity';
import { Hostname } from '../entities/hostname.entity';
import { TemplateUserPersonalization } from '../entities/template-user-personalization.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Template,
      Hostname,
      TemplateUserPersonalization,
    ]),
  ],
  controllers: [TemplatesController, SiteController],
  providers: [TemplatesService],
  exports: [TemplatesService],
})
export class TemplatesModule {}
