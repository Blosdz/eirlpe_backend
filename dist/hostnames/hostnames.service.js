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
const hostname_entity_1 = require("../entities/hostname.entity");
let HostnamesService = class HostnamesService {
    hostnamesRepository;
    constructor(hostnamesRepository) {
        this.hostnamesRepository = hostnamesRepository;
    }
    async checkAvailability(hostname) {
        const normalizedHostname = hostname.toLowerCase().trim();
        const existing = await this.hostnamesRepository.findOne({
            where: { hostname: normalizedHostname },
        });
        return {
            available: !existing,
            hostname: normalizedHostname,
        };
    }
    async register(hostname) {
        const normalizedHostname = hostname.toLowerCase().trim();
        const existing = await this.hostnamesRepository.findOne({
            where: { hostname: normalizedHostname },
        });
        if (existing) {
            throw new Error('Hostname already taken');
        }
        const newHostname = this.hostnamesRepository.create({
            hostname: normalizedHostname,
        });
        return this.hostnamesRepository.save(newHostname);
    }
    async findByHostname(hostname) {
        return this.hostnamesRepository.findOne({
            where: { hostname: hostname.toLowerCase().trim() },
            relations: ['userProfiles', 'templateUserPersonalizations'],
        });
    }
    async findAll() {
        return this.hostnamesRepository.find({
            relations: ['userProfiles', 'templateUserPersonalizations'],
        });
    }
    async findById(id) {
        return this.hostnamesRepository.findOne({
            where: { id },
            relations: ['userProfiles', 'templateUserPersonalizations'],
        });
    }
    async update(id, hostname) {
        const normalizedHostname = hostname.toLowerCase().trim();
        const existing = await this.hostnamesRepository.findOne({
            where: { hostname: normalizedHostname },
        });
        if (existing && existing.id !== id) {
            throw new Error('Hostname already taken');
        }
        await this.hostnamesRepository.update(id, { hostname: normalizedHostname });
        return this.findById(id);
    }
    async delete(id) {
        await this.hostnamesRepository.delete(id);
    }
    async registerWithUser(hostname, userId) {
        const normalizedHostname = hostname.toLowerCase().trim();
        const existing = await this.hostnamesRepository.findOne({
            where: { hostname: normalizedHostname },
        });
        if (existing) {
            throw new Error('Hostname already taken');
        }
        const newHostname = this.hostnamesRepository.create({
            hostname: normalizedHostname,
        });
        return this.hostnamesRepository.save(newHostname);
    }
};
exports.HostnamesService = HostnamesService;
exports.HostnamesService = HostnamesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(hostname_entity_1.Hostname)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], HostnamesService);
//# sourceMappingURL=hostnames.service.js.map