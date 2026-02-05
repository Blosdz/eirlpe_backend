import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hostname } from '../entities';
import { TenantConnectionService } from '../tenant/tenant-connection.service';

@Injectable()
export class HostnamesService {
  private readonly logger = new Logger(HostnamesService.name);

  constructor(
    @InjectRepository(Hostname)
    private hostnameRepository: Repository<Hostname>,
    private tenantConnectionService: TenantConnectionService,
  ) {}

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

  async create(hostname: string): Promise<Hostname> {
    const normalizedHostname = hostname.toLowerCase().trim();

    const existing = await this.findByHostname(normalizedHostname);
    if (existing) {
      throw new BadRequestException('El hostname ya existe');
    }

    const newHostname = this.hostnameRepository.create({
      hostname: normalizedHostname,
    });

    const savedHostname = await this.hostnameRepository.save(newHostname);

    try {
      await this.tenantConnectionService.createTenantDatabase(normalizedHostname);
      this.logger.log(`Tenant database created for: ${normalizedHostname}`);
    } catch (error) {
      this.logger.error(`Failed to create tenant database: ${error.message}`);
      await this.hostnameRepository.remove(savedHostname);
      throw new BadRequestException('Failed to create tenant database');
    }

    return savedHostname;
  }

  async registerWithUser(hostname: string, userId: number): Promise<Hostname> {
    const normalizedHostname = hostname.toLowerCase().trim();

    const existingHostname = await this.findByHostname(normalizedHostname);
    if (existingHostname) {
      throw new BadRequestException('El hostname ya está en uso');
    }

    const newHostname = this.hostnameRepository.create({
      hostname: normalizedHostname,
    });

    const savedHostname = await this.hostnameRepository.save(newHostname);

    try {
      await this.tenantConnectionService.createTenantDatabase(normalizedHostname);
      this.logger.log(`Tenant database created for user ${userId}: ${normalizedHostname}`);
    } catch (error) {
      this.logger.error(`Failed to create tenant database: ${error.message}`);
      await this.hostnameRepository.remove(savedHostname);
      throw new BadRequestException('Failed to create tenant database');
    }

    return savedHostname;
  }

  async remove(id: number): Promise<void> {
    const hostname = await this.findOne(id);
    await this.hostnameRepository.remove(hostname);
  }
}
