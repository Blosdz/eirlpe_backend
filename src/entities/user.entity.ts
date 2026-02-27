import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { UserProfile } from './user-profile.entity';
import { Available } from './available.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string | null;

  @Column({ type: 'varchar', name: 'company_name', length: 255, nullable: true })
  companyName: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  document: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  address: string | null;

  @Column({ type: 'varchar', name: 'ruc_company', length: 100, nullable: true })
  rucCompany: string | null;

  @Column({ length: 255 })
  password: string;

  @Column({ default: 'user' })
  role: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => UserProfile, userProfile => userProfile.user)
  userProfiles: UserProfile[];

  @OneToMany(() => Available, available => available.user)
  availables: Available[];
}