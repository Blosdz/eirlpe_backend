import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hostname } from '../entities';
import { TenantConnectionService } from './tenant-connection.service';

@Injectable()
export class TenantService {
  private hostnameCache = new Map<string, { id: number; expiresAt: number }>();
  private readonly CACHE_TTL = 5 * 60 * 1000;

  constructor(
    @InjectRepository(Hostname)
    private hostnameRepository: Repository<Hostname>,
    private tenantConnectionService: TenantConnectionService,
  ) {}

  async resolveHostname(hostname: string): Promise<{ id: number; hostname: string } | null> {
    const normalizedHostname = hostname.toLowerCase().trim();

    const cached = this.hostnameCache.get(normalizedHostname);
    if (cached && cached.expiresAt > Date.now()) {
      return { id: cached.id, hostname: normalizedHostname };
    }

    const hostnameEntity = await this.hostnameRepository.findOne({
      where: { hostname: normalizedHostname },
    });

    if (!hostnameEntity) {
      return null;
    }

    this.hostnameCache.set(normalizedHostname, {
      id: hostnameEntity.id,
      expiresAt: Date.now() + this.CACHE_TTL,
    });

    return { id: hostnameEntity.id, hostname: normalizedHostname };
  }

  async validateTenantExists(tenantId: number): Promise<boolean> {
    const hostname = await this.hostnameRepository.findOne({
      where: { id: tenantId },
    });
    return !!hostname;
  }

  async getHostnameById(tenantId: number): Promise<Hostname> {
    const hostname = await this.hostnameRepository.findOne({
      where: { id: tenantId },
    });

    if (!hostname) {
      throw new NotFoundException(`Hostname with ID ${tenantId} not found`);
    }

    return hostname;
  }

  async createTenantDatabase(hostname: string): Promise<void> {
    await this.tenantConnectionService.createTenantDatabase(hostname);
  }

  async tenantDatabaseExists(hostname: string): Promise<boolean> {
    return this.tenantConnectionService.tenantDatabaseExists(hostname);
  }

  clearCache(): void {
    this.hostnameCache.clear();
  }
}
