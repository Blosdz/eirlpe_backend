import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tenant_config')
export class TenantConfig {
  @PrimaryGeneratedColumn()
  id: number;

  // Referencia al folder_template de la tabla eirl.template (e.g. 'professional-business')
  @Column({ type: 'varchar', length: 255, name: 'template_id' })
  templateId: string;

  // Nombre visible del negocio, puede sobreescribir el template
  @Column({ type: 'varchar', length: 255, nullable: true, name: 'business_name' })
  businessName: string;

  // Personalizaciones JSON sobre el template base
  @Column({ type: 'jsonb', nullable: true, name: 'customization' })
  customization: Record<string, unknown>;

  // Tenant activo o en mantenimiento
  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
