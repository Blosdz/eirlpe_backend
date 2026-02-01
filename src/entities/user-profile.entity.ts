import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { User } from './user.entity';
import { Hostname } from './hostname.entity';

@Entity('user_profile')
@Unique(['user', 'hostname'])
export class UserProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'users_id' })
  usersId: number;

  @Column({ length: 100, nullable: true })
  document: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ name: 'company_name', length: 255, nullable: true })
  companyName: string;

  @Column({ length: 500, nullable: true })
  address: string;

  @Column({ name: 'ruc_company', length: 100 })
  rucCompany: string;

  @Column({ name: 'hostname_id' })
  hostnameId: number;

  @Column({ name: 'template_user_id', nullable: true })
  templateUserId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, user => user.userProfiles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'users_id' })
  user: User;

  @ManyToOne(() => Hostname, hostname => hostname.userProfiles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hostname_id' })
  hostname: Hostname;
}