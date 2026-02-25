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
var HostnamesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HostnamesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../entities");
const tenant_connection_service_1 = require("../tenant/tenant-connection.service");
let HostnamesService = HostnamesService_1 = class HostnamesService {
    hostnameRepository;
    userProfileRepository;
    tenantConnectionService;
    logger = new common_1.Logger(HostnamesService_1.name);
    constructor(hostnameRepository, userProfileRepository, tenantConnectionService) {
        this.hostnameRepository = hostnameRepository;
        this.userProfileRepository = userProfileRepository;
        this.tenantConnectionService = tenantConnectionService;
    }
    async findAll() {
        return this.hostnameRepository.find({
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const hostname = await this.hostnameRepository.findOne({ where: { id } });
        if (!hostname) {
            throw new common_1.NotFoundException(`Hostname con ID ${id} no encontrado`);
        }
        return hostname;
    }
    async findByHostname(hostname) {
        return this.hostnameRepository.findOne({ where: { hostname } });
    }
    async checkAvailability(hostname) {
        const existing = await this.findByHostname(hostname.toLowerCase());
        return {
            available: !existing,
            hostname: hostname.toLowerCase(),
        };
    }
    async create(hostname, userId) {
        const normalizedHostname = hostname.toLowerCase().trim();
        const existing = await this.findByHostname(normalizedHostname);
        if (existing) {
            throw new common_1.BadRequestException('El hostname ya existe');
        }
        const savedHostname = await this.hostnameRepository.save(this.hostnameRepository.create({ hostname: normalizedHostname }));
        try {
            await this.tenantConnectionService.createTenantDatabase(normalizedHostname);
            this.logger.log(`Tenant database created for: ${normalizedHostname}`);
        }
        catch (error) {
            this.logger.error(`Failed to create tenant database: ${error.message}`);
            await this.hostnameRepository.remove(savedHostname);
            throw new common_1.BadRequestException('Failed to create tenant database');
        }
        if (userId) {
            const existing = await this.userProfileRepository.findOne({
                where: { usersId: userId, hostnameId: savedHostname.id },
            });
            if (!existing) {
                await this.userProfileRepository.save(this.userProfileRepository.create({
                    usersId: userId,
                    hostnameId: savedHostname.id,
                }));
            }
        }
        return savedHostname;
    }
    async registerWithUser(hostname, userId) {
        return this.create(hostname, userId);
    }
    async remove(id) {
        const hostname = await this.findOne(id);
        await this.hostnameRepository.remove(hostname);
    }
};
exports.HostnamesService = HostnamesService;
exports.HostnamesService = HostnamesService = HostnamesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Hostname)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.UserProfile)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        tenant_connection_service_1.TenantConnectionService])
], HostnamesService);
//# sourceMappingURL=hostnames.service.js.map