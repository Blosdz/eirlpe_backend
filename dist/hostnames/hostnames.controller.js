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
exports.HostnamesController = void 0;
const common_1 = require("@nestjs/common");
const hostnames_service_1 = require("./hostnames.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let HostnamesController = class HostnamesController {
    hostnamesService;
    constructor(hostnamesService) {
        this.hostnamesService = hostnamesService;
    }
    async checkAvailability(hostname) {
        return this.hostnamesService.checkAvailability(hostname);
    }
    async findAll() {
        return this.hostnamesService.findAll();
    }
    async findOne(id) {
        return this.hostnamesService.findOne(id);
    }
    async create(body, req) {
        const userId = req.user?.sub ?? req.user?.id;
        return this.hostnamesService.create(body.hostname, userId);
    }
    async update(id, body) {
        return this.hostnamesService.update(id, body.hostname);
    }
    async remove(id) {
        await this.hostnamesService.remove(id);
        return { success: true, message: 'Hostname eliminado' };
    }
};
exports.HostnamesController = HostnamesController;
__decorate([
    (0, common_1.Get)('check/:hostname'),
    __param(0, (0, common_1.Param)('hostname')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HostnamesController.prototype, "checkAvailability", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HostnamesController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], HostnamesController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], HostnamesController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], HostnamesController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], HostnamesController.prototype, "remove", null);
exports.HostnamesController = HostnamesController = __decorate([
    (0, common_1.Controller)('hostnames'),
    __metadata("design:paramtypes", [hostnames_service_1.HostnamesService])
], HostnamesController);
//# sourceMappingURL=hostnames.controller.js.map