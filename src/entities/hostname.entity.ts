import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Unique,
} from 'typeorm';
import { UserProfile } from './user-profile.entity';
import { TemplateUserPersonalization } from '../entities/template-user-personalization.entity';

@Entity('hostnames')
@Unique(['hostname'])
export class Hostname {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  hostname: string;

  @Column({ type: 'int', nullable: true })
  template_user_personalization: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => UserProfile, (userProfile) => userProfile.hostname)
  userProfiles: UserProfile[];

  @OneToMany(
    () => TemplateUserPersonalization,
    (templateUserPersonalization) => templateUserPersonalization.hostname,
  )
  templateUserPersonalizations: TemplateUserPersonalization[];
}
