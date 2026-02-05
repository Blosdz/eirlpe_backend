import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { TenantContextService } from '../tenant/tenant-context.service';
import { TenantContact } from '../tenant-entities';
import { CreateTenantContactDto } from './dto/create-tenant-contact.dto';

@Injectable()
export class TenantContactsService {
  constructor(private readonly tenantContextService: TenantContextService) {}

  private getRepository() {
    const connection = this.tenantContextService.getConnection();
    if (!connection) {
      throw new BadRequestException('Tenant connection not available');
    }
    return connection.getRepository(TenantContact);
  }

  async create(dto: CreateTenantContactDto): Promise<TenantContact> {
    const repository = this.getRepository();

    const contact = repository.create({
      phone: dto.phone,
      mail: dto.mail,
      message: dto.message,
      status: 'pending',
    });

    return repository.save(contact);
  }

  async findAll(): Promise<TenantContact[]> {
    const repository = this.getRepository();
    return repository.find({
      order: { contactDate: 'DESC' },
    });
  }

  async findOne(id: number): Promise<TenantContact> {
    const repository = this.getRepository();
    const contact = await repository.findOne({ where: { id } });

    if (!contact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }

    return contact;
  }

  async updateStatus(id: number, status: string): Promise<TenantContact> {
    const contact = await this.findOne(id);
    contact.status = status;

    const repository = this.getRepository();
    return repository.save(contact);
  }

  async remove(id: number): Promise<void> {
    const contact = await this.findOne(id);
    const repository = this.getRepository();
    await repository.remove(contact);
  }
}
