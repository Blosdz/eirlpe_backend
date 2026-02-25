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
exports.TenantService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../entities");
const tenant_connection_service_1 = require("./tenant-connection.service");
let TenantService = class TenantService {
    hostnameRepository;
    tenantConnectionService;
    hostnameCache = new Map();
    notFoundCache = new Set();
    notFoundExpiry = new Map();
    CACHE_TTL = 5 * 60 * 1000;
    NOT_FOUND_TTL = 1 * 60 * 1000;
    constructor(hostnameRepository, tenantConnectionService) {
        this.hostnameRepository = hostnameRepository;
        this.tenantConnectionService = tenantConnectionService;
    }
    async resolveHostname(hostname) {
        const normalizedHostname = hostname.toLowerCase().trim();
        const now = Date.now();
        const cached = this.hostnameCache.get(normalizedHostname);
        if (cached && cached.expiresAt > now) {
            return { id: cached.id, hostname: normalizedHostname };
        }
        const notFoundExpiry = this.notFoundExpiry.get(normalizedHostname);
        if (this.notFoundCache.has(normalizedHostname) && notFoundExpiry && notFoundExpiry > now) {
            return null;
        }
        const hostnameEntity = await this.hostnameRepository.findOne({
            where: { hostname: normalizedHostname },
        });
        if (!hostnameEntity) {
            this.notFoundCache.add(normalizedHostname);
            this.notFoundExpiry.set(normalizedHostname, now + this.NOT_FOUND_TTL);
            return null;
        }
        this.hostnameCache.set(normalizedHostname, {
            id: hostnameEntity.id,
            expiresAt: now + this.CACHE_TTL,
        });
        this.notFoundCache.delete(normalizedHostname);
        this.notFoundExpiry.delete(normalizedHostname);
        return { id: hostnameEntity.id, hostname: normalizedHostname };
    }
    async validateTenantExists(tenantId) {
        const hostname = await this.hostnameRepository.findOne({
            where: { id: tenantId },
        });
        return !!hostname;
    }
    async getHostnameById(tenantId) {
        const hostname = await this.hostnameRepository.findOne({
            where: { id: tenantId },
        });
        if (!hostname) {
            throw new common_1.NotFoundException(`Hostname with ID ${tenantId} not found`);
        }
        return hostname;
    }
    async createTenantDatabase(hostname) {
        await this.tenantConnectionService.createTenantDatabase(hostname);
    }
    async tenantDatabaseExists(hostname) {
        return this.tenantConnectionService.tenantDatabaseExists(hostname);
    }
    clearCache() {
        this.hostnameCache.clear();
        this.notFoundCache.clear();
        this.notFoundExpiry.clear();
    }
};
exports.TenantService = TenantService;
exports.TenantService = TenantService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Hostname)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        tenant_connection_service_1.TenantConnectionService])
], TenantService);
//# sourceMappingURL=tenant.service.js.map