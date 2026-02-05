import { TenantContextService } from '../tenant/tenant-context.service';
import { TenantContact } from '../tenant-entities';
import { CreateTenantContactDto } from './dto/create-tenant-contact.dto';
export declare class TenantContactsService {
    private readonly tenantContextService;
    constructor(tenantContextService: TenantContextService);
    private getRepository;
    create(dto: CreateTenantContactDto): Promise<TenantContact>;
    findAll(): Promise<TenantContact[]>;
    findOne(id: number): Promise<TenantContact>;
    updateStatus(id: number, status: string): Promise<TenantContact>;
    remove(id: number): Promise<void>;
}
