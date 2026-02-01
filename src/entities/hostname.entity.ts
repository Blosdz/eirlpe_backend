import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { UserProfile } from './user-profile.entity';

@Entity('hostnames')
export class Hostname {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 255 })
  hostname: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => UserProfile, userProfile => userProfile.hostname)
  userProfiles: UserProfile[];
}