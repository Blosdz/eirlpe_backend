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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantConfigController = void 0;
const common_1 = require("@nestjs/common");
const tenant_config_service_1 = require("./tenant-config.service");
const upsert_tenant_config_dto_1 = require("./dto/upsert-tenant-config.dto");
const tenant_guard_1 = require("../tenant/guards/tenant.guard");
const require_tenant_decorator_1 = require("../tenant/decorators/require-tenant.decorator");
const tenant_jwt_auth_guard_1 = require("../tenant-users/guards/tenant-jwt-auth.guard");
const template_renderer_service_1 = require("../tenant-page/template-renderer.service");
let TenantConfigController = class TenantConfigController {
    service;
    constructor(service) {
        this.service = service;
    }
    getConfig() {
        return this.service.getConfig();
    }
    async getEditorData() {
        let config = null;
        try {
            config = await this.service.getConfig();
        }
        catch {
        }
        const saved = (config?.customization ?? {});
        const fields = template_renderer_service_1.MARKERS_META.map((meta) => ({
            key: meta.key,
            label: meta.label,
            group: meta.group,
            hint: meta.hint ?? null,
            defaultValue: meta.defaultValue,
            currentValue: saved[meta.key] ?? template_renderer_service_1.MARKER_DEFAULTS[meta.key] ?? meta.defaultValue,
        }));
        return {
            templateId: config?.templateId ?? null,
            fields,
        };
    }
    upsert(dto) {
        return this.service.upsert(dto);
    }
};
exports.TenantConfigController = TenantConfigController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TenantConfigController.prototype, "getConfig", null);
__decorate([
    (0, common_1.Get)('editor-data'),
    (0, common_1.UseGuards)(tenant_jwt_auth_guard_1.TenantJwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TenantConfigController.prototype, "getEditorData", null);
__decorate([
    (0, common_1.Put)(),
    (0, common_1.UseGuards)(tenant_jwt_auth_guard_1.TenantJwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [upsert_tenant_config_dto_1.UpsertTenantConfigDto]),
    __metadata("design:returntype", void 0)
], TenantConfigController.prototype, "upsert", null);
exports.TenantConfigController = TenantConfigController = __decorate([
    (0, common_1.Controller)('tenant-config'),
    (0, require_tenant_decorator_1.RequireTenant)(),
    (0, common_1.UseGuards)(tenant_guard_1.TenantGuard),
    __metadata("design:paramtypes", [tenant_config_service_1.TenantConfigService])
], TenantConfigController);
//# sourceMappingURL=tenant-config.controller.js.map