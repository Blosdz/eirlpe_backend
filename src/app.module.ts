import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { HostnamesModule } from './hostnames/hostnames.module';
import { AuthModule } from './auth/auth.module';
import { PagesModule } from './pages/pages.module';
import { PaymentsModule } from './payments/payments.module';
import { TemplatesModule } from './templates/templates.module';

@Module({
  imports: [
    DatabaseModule,
    HostnamesModule,
    AuthModule,
    PagesModule,
    PaymentsModule,
    TemplatesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
