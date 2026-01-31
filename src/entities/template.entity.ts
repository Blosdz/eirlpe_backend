import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { TemplateUserPersonalization } from './template-user-personalization.entity';

@Entity('template')
export class Template {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  template_json: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  folder_template: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  prices_stimation: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(
    () => TemplateUserPersonalization,
    (templateUserPersonalization) => templateUserPersonalization.template,
  )
  templateUserPersonalizations: TemplateUserPersonalization[];
}
