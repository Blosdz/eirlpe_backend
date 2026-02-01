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
exports.UserProfileService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../entities");
let UserProfileService = class UserProfileService {
    userProfileRepository;
    constructor(userProfileRepository) {
        this.userProfileRepository = userProfileRepository;
    }
    async findAll() {
        return this.userProfileRepository.find({
            relations: ['user', 'hostname'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const profile = await this.userProfileRepository.findOne({
            where: { id },
            relations: ['user', 'hostname'],
        });
        if (!profile) {
            throw new common_1.NotFoundException(`Perfil con ID ${id} no encontrado`);
        }
        return profile;
    }
    async findByUserId(userId) {
        return this.userProfileRepository.find({
            where: { usersId: userId },
            relations: ['hostname'],
        });
    }
    async findByHostnameId(hostnameId) {
        return this.userProfileRepository.find({
            where: { hostnameId },
            relations: ['user'],
        });
    }
    async update(id, updateDto) {
        const profile = await this.findOne(id);
        if (updateDto.document !== undefined)
            profile.document = updateDto.document;
        if (updateDto.phone !== undefined)
            profile.phone = updateDto.phone;
        if (updateDto.companyName !== undefined)
            profile.companyName = updateDto.companyName;
        if (updateDto.address !== undefined)
            profile.address = updateDto.address;
        if (updateDto.rucCompany !== undefined)
            profile.rucCompany = updateDto.rucCompany;
        return this.userProfileRepository.save(profile);
    }
    async remove(id) {
        const profile = await this.findOne(id);
        await this.userProfileRepository.remove(profile);
    }
};
exports.UserProfileService = UserProfileService;
exports.UserProfileService = UserProfileService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.UserProfile)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserProfileService);
//# sourceMappingURL=user-profile.service.js.map