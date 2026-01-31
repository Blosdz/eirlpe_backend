import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Unique,
} from 'typeorm';
import { Hostname } from './hostname.entity';
import { User } from './user.entity';
import { Template } from './template.entity';
import { UserProfile } from './user-profile.entity';

@Entity('template_user_personalization')
@Unique('unique_user_template', ['hostname', 'user', 'template'])
export class TemplateUserPersonalization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  hostname_id: number;

  @Column({ type: 'int' })
  user_id: number;

  @Column({ type: 'int' })
  template_id: number;

  @Column({ type: 'text', nullable: true })
  template_json_personalization: string;

  @Column({ type: 'boolean', default: true })
  cobros_available: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Hostname, (hostname) => hostname.templateUserPersonalizations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'hostname_id' })
  hostname: Hostname;

  @ManyToOne(() => User, (user) => user.templateUserPersonalizations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Template, (template) => template.templateUserPersonalizations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'template_id' })
  template: Template;

  @OneToMany(
    () => UserProfile,
    (userProfile) => userProfile.templateUserPersonalization,
  )
  userProfiles: UserProfile[];
}
