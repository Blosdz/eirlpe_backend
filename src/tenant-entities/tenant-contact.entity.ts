import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('tenant_contacts')
export class TenantContact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  mail: string;

  @Column({ type: 'text', nullable: true })
  message: string;

  @CreateDateColumn({ name: 'contact_date' })
  contactDate: Date;

  @Column({ type: 'varchar', length: 50, default: 'pending' })
  status: string;
}
