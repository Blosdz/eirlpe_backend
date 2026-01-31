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
import { Cobro } from '../entities/cobro.entity';
import { TemplateUserPersonalization } from './template-user-personalization.entity';

@Entity('users')
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => UserProfile, (userProfile) => userProfile.user)
  userProfiles: UserProfile[];

  @OneToMany(() => Cobro, (cobro) => cobro.user)
  cobros: Cobro[];

  @OneToMany(
    () => TemplateUserPersonalization,
    (templateUserPersonalization) => templateUserPersonalization.user,
  )
  templateUserPersonalizations: TemplateUserPersonalization[];
}
