import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvailableService } from './available.service';
import { AvailableController } from './available.controller';
import { Available } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Available])],
  controllers: [AvailableController],
  providers: [AvailableService],
  exports: [AvailableService],
})
export class AvailableModule {}
