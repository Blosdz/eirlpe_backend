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
exports.TenantPluginsController = void 0;
const common_1 = require("@nestjs/common");
const tenant_plugins_service_1 = require("./tenant-plugins.service");
const update_plugin_dto_1 = require("./dto/update-plugin.dto");
const tenant_guard_1 = require("../tenant/guards/tenant.guard");
const require_tenant_decorator_1 = require("../tenant/decorators/require-tenant.decorator");
const tenant_jwt_auth_guard_1 = require("../tenant-users/guards/tenant-jwt-auth.guard");
let TenantPluginsController = class TenantPluginsController {
    service;
    constructor(service) {
        this.service = service;
    }
    getActive() {
        return this.service.getActivePlugins();
    }
    findAll() {
        return this.service.findAll();
    }
    findOne(key) {
        return this.service.findByKey(key);
    }
    update(key, dto) {
        return this.service.update(key, dto);
    }
};
exports.TenantPluginsController = TenantPluginsController;
__decorate([
    (0, common_1.Get)('active'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TenantPluginsController.prototype, "getActive", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(tenant_jwt_auth_guard_1.TenantJwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TenantPluginsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':key'),
    (0, common_1.UseGuards)(tenant_jwt_auth_guard_1.TenantJwtAuthGuard),
    __param(0, (0, common_1.Param)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TenantPluginsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':key'),
    (0, common_1.UseGuards)(tenant_jwt_auth_guard_1.TenantJwtAuthGuard),
    __param(0, (0, common_1.Param)('key')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_plugin_dto_1.UpdatePluginDto]),
    __metadata("design:returntype", void 0)
], TenantPluginsController.prototype, "update", null);
exports.TenantPluginsController = TenantPluginsController = __decorate([
    (0, common_1.Controller)('tenant-plugins'),
    (0, require_tenant_decorator_1.RequireTenant)(),
    (0, common_1.UseGuards)(tenant_guard_1.TenantGuard),
    __metadata("design:paramtypes", [tenant_plugins_service_1.TenantPluginsService])
], TenantPluginsController);
//# sourceMappingURL=tenant-plugins.controller.js.map