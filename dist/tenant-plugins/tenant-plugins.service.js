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
exports.TenantPluginsService = void 0;
const common_1 = require("@nestjs/common");
const tenant_context_service_1 = require("../tenant/tenant-context.service");
const tenant_entities_1 = require("../tenant-entities");
let TenantPluginsService = class TenantPluginsService {
    tenantContextService;
    constructor(tenantContextService) {
        this.tenantContextService = tenantContextService;
    }
    getRepository() {
        const connection = this.tenantContextService.getConnection();
        if (!connection)
            throw new common_1.BadRequestException('Tenant connection not available');
        return connection.getRepository(tenant_entities_1.TenantPlugin);
    }
    async findAll() {
        return this.getRepository().find({ order: { pluginKey: 'ASC' } });
    }
    async findByKey(pluginKey) {
        const plugin = await this.getRepository().findOne({ where: { pluginKey } });
        if (!plugin)
            throw new common_1.NotFoundException(`Plugin '${pluginKey}' not found`);
        return plugin;
    }
    async update(pluginKey, dto) {
        const plugin = await this.findByKey(pluginKey);
        if (dto.isActive !== undefined)
            plugin.isActive = dto.isActive;
        if (dto.config !== undefined) {
            plugin.config = { ...plugin.config, ...dto.config };
        }
        return this.getRepository().save(plugin);
    }
    async getActivePlugins() {
        return this.getRepository().find({ where: { isActive: true } });
    }
};
exports.TenantPluginsService = TenantPluginsService;
exports.TenantPluginsService = TenantPluginsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_context_service_1.TenantContextService])
], TenantPluginsService);
//# sourceMappingURL=tenant-plugins.service.js.map