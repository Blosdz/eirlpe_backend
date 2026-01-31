import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Hostname,
  User,
  UserProfile,
  Template,
  TemplateUserPersonalization,
  Cobro,
} from '../entities';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'irl',
        schema: process.env.DB_SCHEMA || 'eirl',
        entities: [
          Hostname,
          User,
          UserProfile,
          Template,
          TemplateUserPersonalization,
          Cobro,
        ],
        synchronize: process.env.NODE_ENV !== 'production',
        logging: process.env.NODE_ENV !== 'production',
      }),
    }),
    TypeOrmModule.forFeature([
      Hostname,
      User,
      UserProfile,
      Template,
      TemplateUserPersonalization,
      Cobro,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
