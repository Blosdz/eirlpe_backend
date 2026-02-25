import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HostnamesService } from './hostnames.service';
import { HostnamesController } from './hostnames.controller';
import { Hostname, UserProfile } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Hostname, UserProfile])],
  controllers: [HostnamesController],
  providers: [HostnamesService],
  exports: [HostnamesService],
})
export class HostnamesModule {}
