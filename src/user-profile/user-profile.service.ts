import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProfile } from '../entities';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';

@Injectable()
export class UserProfileService {
  constructor(
    @InjectRepository(UserProfile)
    private userProfileRepository: Repository<UserProfile>,
  ) {}

  async findAll(): Promise<UserProfile[]> {
    return this.userProfileRepository.find({
      relations: ['user', 'hostname'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<UserProfile> {
    const profile = await this.userProfileRepository.findOne({
      where: { id },
      relations: ['user', 'hostname'],
    });
    if (!profile) {
      throw new NotFoundException(`Perfil con ID ${id} no encontrado`);
    }
    return profile;
  }

  async findByUserId(userId: number): Promise<UserProfile[]> {
    return this.userProfileRepository.find({
      where: { usersId: userId },
      relations: ['hostname'],
    });
  }

  async findByHostnameId(hostnameId: number): Promise<UserProfile[]> {
    return this.userProfileRepository.find({
      where: { hostnameId },
      relations: ['user'],
    });
  }

  async update(id: number, updateDto: UpdateUserProfileDto): Promise<UserProfile> {
    const profile = await this.findOne(id);

    if (updateDto.document !== undefined) profile.document = updateDto.document;
    if (updateDto.phone !== undefined) profile.phone = updateDto.phone;
    if (updateDto.companyName !== undefined) profile.companyName = updateDto.companyName;
    if (updateDto.address !== undefined) profile.address = updateDto.address;
    if (updateDto.rucCompany !== undefined) profile.rucCompany = updateDto.rucCompany;

    return this.userProfileRepository.save(profile);
  }

  async remove(id: number): Promise<void> {
    const profile = await this.findOne(id);
    await this.userProfileRepository.remove(profile);
  }
}
