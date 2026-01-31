import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hostname } from '../entities/hostname.entity';

@Injectable()
export class HostnamesService {
  constructor(
    @InjectRepository(Hostname)
    private hostnamesRepository: Repository<Hostname>,
  ) {}

  /**
   * Check if a hostname is available
   */
  async checkAvailability(hostname: string): Promise<{
    available: boolean;
    hostname: string;
  }> {
    const normalizedHostname = hostname.toLowerCase().trim();
    
    const existing = await this.hostnamesRepository.findOne({
      where: { hostname: normalizedHostname },
    });

    return {
      available: !existing,
      hostname: normalizedHostname,
    };
  }

  /**
   * Register a new hostname
   */
  async register(hostname: string): Promise<Hostname> {
    const normalizedHostname = hostname.toLowerCase().trim();

    // Check if already exists
    const existing = await this.hostnamesRepository.findOne({
      where: { hostname: normalizedHostname },
    });

    if (existing) {
      throw new Error('Hostname already taken');
    }

    const newHostname = this.hostnamesRepository.create({
      hostname: normalizedHostname,
    });

    return this.hostnamesRepository.save(newHostname);
  }

  /**
   * Get hostname by name
   */
  async findByHostname(hostname: string): Promise<Hostname | null> {
    return this.hostnamesRepository.findOne({
      where: { hostname: hostname.toLowerCase().trim() },
      relations: ['userProfiles', 'templateUserPersonalizations'],
    });
  }

  /**
   * Get all hostnames
   */
  async findAll(): Promise<Hostname[]> {
    return this.hostnamesRepository.find({
      relations: ['userProfiles', 'templateUserPersonalizations'],
    });
  }

  /**
   * Get hostname by ID
   */
  async findById(id: number): Promise<Hostname | null> {
    return this.hostnamesRepository.findOne({
      where: { id },
      relations: ['userProfiles', 'templateUserPersonalizations'],
    });
  }

  /**
   * Update hostname
   */
  async update(id: number, hostname: string): Promise<Hostname | null> {
    const normalizedHostname = hostname.toLowerCase().trim();

    // Check if new hostname already exists
    const existing = await this.hostnamesRepository.findOne({
      where: { hostname: normalizedHostname },
    });

    if (existing && existing.id !== id) {
      throw new Error('Hostname already taken');
    }

    await this.hostnamesRepository.update(id, { hostname: normalizedHostname });
    return this.findById(id);
  }

  /**
   * Delete hostname
   */
  async delete(id: number): Promise<void> {
    await this.hostnamesRepository.delete(id);
  }

  /**
   * Register hostname with user association (for multi-tenant)
   */
  async registerWithUser(hostname: string, userId: number): Promise<Hostname> {
    const normalizedHostname = hostname.toLowerCase().trim();

    // Check if already exists
    const existing = await this.hostnamesRepository.findOne({
      where: { hostname: normalizedHostname },
    });

    if (existing) {
      throw new Error('Hostname already taken');
    }

    const newHostname = this.hostnamesRepository.create({
      hostname: normalizedHostname,
    });

    return this.hostnamesRepository.save(newHostname);
  }
}
