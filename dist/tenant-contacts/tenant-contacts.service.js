"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantContactsService = void 0;
const common_1 = require("@nestjs/common");
const tenant_context_service_1 = require("../tenant/tenant-context.service");
const tenant_entities_1 = require("../tenant-entities");
let TenantContactsService = class TenantContactsService {
    tenantContextService;
    constructor(tenantContextService) {
        this.tenantContextService = tenantContextService;
    }
    getRepository() {
        const connection = this.tenantContextService.getConnection();
        if (!connection) {
            throw new common_1.BadRequestException('Tenant connection not available');
        }
        return connection.getRepository(tenant_entities_1.TenantContact);
    }
    async create(dto) {
        const repository = this.getRepository();
        const contact = repository.create({
            phone: dto.phone,
            mail: dto.mail,
            message: dto.message,
            status: 'pending',
        });
        return repository.save(contact);
    }
    async findAll() {
        const repository = this.getRepository();
        return repository.find({
            order: { contactDate: 'DESC' },
        });
    }
    async findOne(id) {
        const repository = this.getRepository();
        const contact = await repository.findOne({ where: { id } });
        if (!contact) {
            throw new common_1.NotFoundException(`Contact with ID ${id} not found`);
        }
        return contact;
    }
    async updateStatus(id, status) {
        const contact = await this.findOne(id);
        contact.status = status;
        const repository = this.getRepository();
        return repository.save(contact);
    }
    async remove(id) {
        const contact = await this.findOne(id);
        const repository = this.getRepository();
        await repository.remove(contact);
    }
};
exports.TenantContactsService = TenantContactsService;
exports.TenantContactsService = TenantContactsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_context_service_1.TenantContextService])
], TenantContactsService);
//# sourceMappingURL=tenant-contacts.service.js.map