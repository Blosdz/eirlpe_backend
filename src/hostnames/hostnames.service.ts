import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hostname } from '../entities';

@Injectable()
export class HostnamesService {
  constructor(
    @InjectRepository(Hostname)
    private hostnameRepository: Repository<Hostname>,
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

    return this.hostnameRepository.save(newHostname);
  }

  async registerWithUser(hostname: string, userId: number): Promise<Hostname> {
    const normalizedHostname = hostname.toLowerCase().trim();

    let existingHostname = await this.findByHostname(normalizedHostname);
    if (existingHostname) {
      throw new BadRequestException('El hostname ya está en uso');
    }

    const newHostname = this.hostnameRepository.create({
      hostname: normalizedHostname,
    });

    return this.hostnameRepository.save(newHostname);
  }

  async remove(id: number): Promise<void> {
    const hostname = await this.findOne(id);
    await this.hostnameRepository.remove(hostname);
  }
}
