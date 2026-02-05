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
exports.TenantUsersController = void 0;
const common_1 = require("@nestjs/common");
const tenant_users_service_1 = require("./tenant-users.service");
const create_tenant_user_dto_1 = require("./dto/create-tenant-user.dto");
const login_tenant_user_dto_1 = require("./dto/login-tenant-user.dto");
const tenant_guard_1 = require("../tenant/guards/tenant.guard");
const require_tenant_decorator_1 = require("../tenant/decorators/require-tenant.decorator");
const tenant_jwt_auth_guard_1 = require("./guards/tenant-jwt-auth.guard");
const current_tenant_user_decorator_1 = require("./decorators/current-tenant-user.decorator");
let TenantUsersController = class TenantUsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    async register(dto) {
        return this.usersService.register(dto);
    }
    async login(dto) {
        return this.usersService.login(dto);
    }
    async getProfile(user) {
        return {
            success: true,
            user: {
                id: user.id,
                mail: user.mail,
                name: user.name,
                role: user.role,
                tenantId: user.tenantId,
                hostname: user.hostname,
            },
        };
    }
    async findAll(role) {
        if (role !== 'admin') {
            return { success: false, message: 'Admin access required' };
        }
        return this.usersService.findAll();
    }
    async findOne(id, role) {
        if (role !== 'admin') {
            return { success: false, message: 'Admin access required' };
        }
        const user = await this.usersService.findById(id);
        return {
            id: user.id,
            mail: user.mail,
            name: user.name,
            role: user.role,
            status: user.status,
            createdAt: user.createdAt,
            lastLoginAt: user.lastLoginAt,
        };
    }
    async updateStatus(id, status, role) {
        if (role !== 'admin') {
            return { success: false, message: 'Admin access required' };
        }
        return this.usersService.updateStatus(id, status);
    }
    async updateRole(id, newRole, role) {
        if (role !== 'admin') {
            return { success: false, message: 'Admin access required' };
        }
        return this.usersService.updateRole(id, newRole);
    }
};
exports.TenantUsersController = TenantUsersController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_tenant_user_dto_1.CreateTenantUserDto]),
    __metadata("design:returntype", Promise)
], TenantUsersController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_tenant_user_dto_1.LoginTenantUserDto]),
    __metadata("design:returntype", Promise)
], TenantUsersController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, common_1.UseGuards)(tenant_jwt_auth_guard_1.TenantJwtAuthGuard),
    __param(0, (0, current_tenant_user_decorator_1.CurrentTenantUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TenantUsersController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(tenant_jwt_auth_guard_1.TenantJwtAuthGuard),
    __param(0, (0, current_tenant_user_decorator_1.CurrentTenantUser)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TenantUsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(tenant_jwt_auth_guard_1.TenantJwtAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, current_tenant_user_decorator_1.CurrentTenantUser)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], TenantUsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, common_1.UseGuards)(tenant_jwt_auth_guard_1.TenantJwtAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('status')),
    __param(2, (0, current_tenant_user_decorator_1.CurrentTenantUser)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String]),
    __metadata("design:returntype", Promise)
], TenantUsersController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Patch)(':id/role'),
    (0, common_1.UseGuards)(tenant_jwt_auth_guard_1.TenantJwtAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('role')),
    __param(2, (0, current_tenant_user_decorator_1.CurrentTenantUser)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String]),
    __metadata("design:returntype", Promise)
], TenantUsersController.prototype, "updateRole", null);
exports.TenantUsersController = TenantUsersController = __decorate([
    (0, common_1.Controller)('tenant-users'),
    (0, require_tenant_decorator_1.RequireTenant)(),
    (0, common_1.UseGuards)(tenant_guard_1.TenantGuard),
    __metadata("design:paramtypes", [tenant_users_service_1.TenantUsersService])
], TenantUsersController);
//# sourceMappingURL=tenant-users.controller.js.map