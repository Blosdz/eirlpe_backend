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
exports.TenantConfigService = void 0;
const common_1 = require("@nestjs/common");
const tenant_context_service_1 = require("../tenant/tenant-context.service");
const tenant_entities_1 = require("../tenant-entities");
let TenantConfigService = class TenantConfigService {
    tenantContextService;
    constructor(tenantContextService) {
        this.tenantContextService = tenantContextService;
    }
    getRepository() {
        const connection = this.tenantContextService.getConnection();
        if (!connection)
            throw new common_1.BadRequestException('Tenant connection not available');
        return connection.getRepository(tenant_entities_1.TenantConfig);
    }
    async getConfig() {
        const repo = this.getRepository();
        const config = await repo.findOne({ where: { isActive: true } });
        if (!config)
            throw new common_1.NotFoundException('Config not found for this tenant');
        return config;
    }
    async upsert(dto) {
        const repo = this.getRepository();
        let config = await repo.findOne({ where: { isActive: true } });
        if (config) {
            config.templateId = dto.templateId;
            if (dto.businessName !== undefined)
                config.businessName = dto.businessName;
            if (dto.customization !== undefined)
                config.customization = dto.customization;
            if (dto.isActive !== undefined)
                config.isActive = dto.isActive;
        }
        else {
            config = repo.create({
                templateId: dto.templateId,
                businessName: dto.businessName,
                customization: dto.customization ?? {},
                isActive: dto.isActive ?? true,
            });
        }
        return repo.save(config);
    }
};
exports.TenantConfigService = TenantConfigService;
exports.TenantConfigService = TenantConfigService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_context_service_1.TenantContextService])
], TenantConfigService);
//# sourceMappingURL=tenant-config.service.js.map