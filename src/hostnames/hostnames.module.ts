import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hostname } from '../entities/hostname.entity';
import { HostnamesService } from './hostnames.service';
import { HostnamesController } from './hostnames.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Hostname])],
  controllers: [HostnamesController],
  providers: [HostnamesService],
  exports: [HostnamesService],
})
export class HostnamesModule {}
