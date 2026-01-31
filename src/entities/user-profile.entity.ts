import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { Hostname } from './hostname.entity';
import { TemplateUserPersonalization } from './template-user-personalization.entity';

@Entity('user_profile')
@Unique('unique_user_hostname', ['user', 'hostname'])
export class UserProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  users_id: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  document: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  company_name: string;

  @Column({ type: 'int' })
  hostname_id: number;

  @Column({ type: 'int', nullable: true })
  template_user_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.userProfiles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'users_id' })
  user: User;

  @ManyToOne(() => Hostname, (hostname) => hostname.userProfiles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'hostname_id' })
  hostname: Hostname;

  @ManyToOne(
    () => TemplateUserPersonalization,
    (templateUserPersonalization) => templateUserPersonalization.userProfiles,
    { nullable: true, onDelete: 'SET NULL' },
  )
  @JoinColumn({ name: 'template_user_id' })
  templateUserPersonalization: TemplateUserPersonalization;
}
