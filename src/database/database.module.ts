import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Hostname, UserProfile, Available } from '../entities';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User, Hostname, UserProfile, Available])],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
