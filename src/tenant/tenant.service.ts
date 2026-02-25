import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hostname } from '../entities';
import { TenantConnectionService } from './tenant-connection.service';

@Injectable()
export class TenantService {
  // Cache para hostnames encontrados { id, expiresAt }
  private hostnameCache = new Map<string, { id: number; expiresAt: number }>();
  // Cache para hostnames NO encontrados (negative cache) — TTL más corto
  private notFoundCache = new Set<string>();
  private notFoundExpiry = new Map<string, number>();

  private readonly CACHE_TTL     = 5 * 60 * 1000; // 5 min — hostnames válidos
  private readonly NOT_FOUND_TTL = 1 * 60 * 1000; // 1 min — hostnames inválidos

  constructor(
    @InjectRepository(Hostname)
    private hostnameRepository: Repository<Hostname>,
    private tenantConnectionService: TenantConnectionService,
  ) {}

  async resolveHostname(hostname: string): Promise<{ id: number; hostname: string } | null> {
    const normalizedHostname = hostname.toLowerCase().trim();
    const now = Date.now();

    // 1. Cache positivo — hostname válido conocido
    const cached = this.hostnameCache.get(normalizedHostname);
    if (cached && cached.expiresAt > now) {
      return { id: cached.id, hostname: normalizedHostname };
    }

    // 2. Cache negativo — hostname inválido conocido (evita query repetida)
    const notFoundExpiry = this.notFoundExpiry.get(normalizedHostname);
    if (this.notFoundCache.has(normalizedHostname) && notFoundExpiry && notFoundExpiry > now) {
      return null;
    }

    // 3. Consultar BD
    const hostnameEntity = await this.hostnameRepository.findOne({
      where: { hostname: normalizedHostname },
    });

    if (!hostnameEntity) {
      // Guardar en cache negativo por 1 minuto
      this.notFoundCache.add(normalizedHostname);
      this.notFoundExpiry.set(normalizedHostname, now + this.NOT_FOUND_TTL);
      return null;
    }

    // Guardar en cache positivo por 5 minutos
    this.hostnameCache.set(normalizedHostname, {
      id: hostnameEntity.id,
      expiresAt: now + this.CACHE_TTL,
    });
    // Limpiar del cache negativo si estaba ahí
    this.notFoundCache.delete(normalizedHostname);
    this.notFoundExpiry.delete(normalizedHostname);

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
    this.notFoundCache.clear();
    this.notFoundExpiry.clear();
  }
}
