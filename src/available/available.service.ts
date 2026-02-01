import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Available } from '../entities';

@Injectable()
export class AvailableService {
  constructor(
    @InjectRepository(Available)
    private availableRepository: Repository<Available>,
  ) {}

  async findAll(): Promise<Available[]> {
    return this.availableRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Available> {
    const available = await this.availableRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!available) {
      throw new NotFoundException(`Registro de disponibilidad con ID ${id} no encontrado`);
    }
    return available;
  }

  async findByUserId(userId: number): Promise<Available | null> {
    return this.availableRepository.findOne({
      where: { userId },
    });
  }

  async checkUserAvailability(userId: number): Promise<{ available: boolean; userId: number }> {
    const record = await this.findByUserId(userId);
    return {
      available: record ? record.available : true,
      userId,
    };
  }

  async setAvailability(userId: number, available: boolean): Promise<Available> {
    let record = await this.findByUserId(userId);

    if (record) {
      record.available = available;
      return this.availableRepository.save(record);
    }

    const newRecord = this.availableRepository.create({
      userId,
      available,
    });
    return this.availableRepository.save(newRecord);
  }

  async remove(id: number): Promise<void> {
    const available = await this.findOne(id);
    await this.availableRepository.remove(available);
  }
}
