import { TenantContactsService } from './tenant-contacts.service';
import { CreateTenantContactDto } from './dto/create-tenant-contact.dto';
export declare class TenantContactsController {
    private readonly contactsService;
    constructor(contactsService: TenantContactsService);
    create(dto: CreateTenantContactDto): Promise<import("../tenant-entities").TenantContact>;
    findAll(): Promise<import("../tenant-entities").TenantContact[]>;
    findOne(id: number): Promise<import("../tenant-entities").TenantContact>;
    updateStatus(id: number, status: string): Promise<import("../tenant-entities").TenantContact>;
    remove(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
}
