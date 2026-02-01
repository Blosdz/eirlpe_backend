import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HostnamesService } from './hostnames.service';
import { HostnamesController } from './hostnames.controller';
import { Hostname } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Hostname])],
  controllers: [HostnamesController],
  providers: [HostnamesService],
  exports: [HostnamesService],
})
export class HostnamesModule {}
