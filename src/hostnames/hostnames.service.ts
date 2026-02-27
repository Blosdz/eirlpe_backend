import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hostname, UserProfile } from '../entities';
import { TenantConnectionService } from '../tenant/tenant-connection.service';
import { TenantConfig } from '../tenant-entities';

@Injectable()
export class HostnamesService {
  private readonly logger = new Logger(HostnamesService.name);

  constructor(
    @InjectRepository(Hostname)
    private hostnameRepository: Repository<Hostname>,
    @InjectRepository(UserProfile)
    private userProfileRepository: Repository<UserProfile>,
    private tenantConnectionService: TenantConnectionService,
  ) { }

  async findAll(): Promise<Hostname[]> {
    return this.hostnameRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Hostname> {
    const hostname = await this.hostnameRepository.findOne({ where: { id } });
    if (!hostname) {
      throw new NotFoundException(`Hostname con ID ${id} no encontrado`);
    }
    return hostname;
  }

  async findByHostname(hostname: string): Promise<Hostname | null> {
    return this.hostnameRepository.findOne({ where: { hostname } });
  }

  async checkAvailability(hostname: string): Promise<{ available: boolean; hostname: string }> {
    const existing = await this.findByHostname(hostname.toLowerCase());
    return {
      available: !existing,
      hostname: hostname.toLowerCase(),
    };
  }

  /**
   * Crea el hostname, la BD del tenant, vincula al usuario y
   * opcionalmente inicializa el TenantConfig con el templateId elegido.
   */
  async create(
    hostname: string,
    userId?: number,
    templateId?: string,
  ): Promise<Hostname> {
    const normalizedHostname = hostname.toLowerCase().trim();

    const existing = await this.findByHostname(normalizedHostname);
    if (existing) {
      throw new BadRequestException('El hostname ya existe');
    }

    const savedHostname = await this.hostnameRepository.save(
      this.hostnameRepository.create({ hostname: normalizedHostname }),
    );

    try {
      await this.tenantConnectionService.createTenantDatabase(normalizedHostname);
      this.logger.log(`Tenant database created for: ${normalizedHostname}`);
    } catch (error) {
      this.logger.error(`Failed to create tenant database: ${error.message}`);
      await this.hostnameRepository.remove(savedHostname);
      throw new BadRequestException('Failed to create tenant database');
    }

    // Vincular el usuario al hostname via user_profile
    if (userId) {
      const userProfileExists = await this.userProfileRepository.findOne({
        where: { usersId: userId, hostnameId: savedHostname.id },
      });
      if (!userProfileExists) {
        await this.userProfileRepository.save(
          this.userProfileRepository.create({
            usersId: userId,
            hostnameId: savedHostname.id,
          }),
        );
      }
    }

    // Crear configuración inicial del tenant si se proporcionó un templateId
    if (templateId) {
      try {
        const tenantConnection = await this.tenantConnectionService.getConnection(normalizedHostname);
        const configRepo = tenantConnection.getRepository(TenantConfig);
        const alreadyExists = await configRepo.findOne({ where: { isActive: true } });
        if (!alreadyExists) {
          await configRepo.save(
            configRepo.create({
              templateId,
              businessName: undefined as any,
              customization: {},
              isActive: true,
            }),
          );
          this.logger.log(`TenantConfig inicial creada para ${normalizedHostname} con template: ${templateId}`);
        }
      } catch (error) {
        // No bloquear el registro si falla la config inicial — se puede configurar después
        this.logger.warn(`No se pudo crear TenantConfig para ${normalizedHostname}: ${error.message}`);
      }
    }

    return savedHostname;
  }

  async registerWithUser(hostname: string, userId: number): Promise<Hostname> {
    return this.create(hostname, userId);
  }

  async update(id: number, hostname: string): Promise<Hostname> {
    const existing = await this.findOne(id);
    existing.hostname = hostname.toLowerCase().trim();
    return this.hostnameRepository.save(existing);
  }

  async remove(id: number): Promise<void> {
    const hostname = await this.findOne(id);
    await this.hostnameRepository.remove(hostname);
  }
}
