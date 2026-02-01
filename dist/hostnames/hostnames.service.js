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
exports.HostnamesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../entities");
let HostnamesService = class HostnamesService {
    hostnameRepository;
    constructor(hostnameRepository) {
        this.hostnameRepository = hostnameRepository;
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
    async create(hostname) {
        const normalizedHostname = hostname.toLowerCase().trim();
        const existing = await this.findByHostname(normalizedHostname);
        if (existing) {
            throw new common_1.BadRequestException('El hostname ya existe');
        }
        const newHostname = this.hostnameRepository.create({
            hostname: normalizedHostname,
        });
        return this.hostnameRepository.save(newHostname);
    }
    async registerWithUser(hostname, userId) {
        const normalizedHostname = hostname.toLowerCase().trim();
        let existingHostname = await this.findByHostname(normalizedHostname);
        if (existingHostname) {
            throw new common_1.BadRequestException('El hostname ya está en uso');
        }
        const newHostname = this.hostnameRepository.create({
            hostname: normalizedHostname,
        });
        return this.hostnameRepository.save(newHostname);
    }
    async remove(id) {
        const hostname = await this.findOne(id);
        await this.hostnameRepository.remove(hostname);
    }
};
exports.HostnamesService = HostnamesService;
exports.HostnamesService = HostnamesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Hostname)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], HostnamesService);
//# sourceMappingURL=hostnames.service.js.map