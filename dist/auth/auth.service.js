"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const hostnames_service_1 = require("../hostnames/hostnames.service");
const entities_1 = require("../entities");
const bcrypt = __importStar(require("bcrypt"));
let AuthService = class AuthService {
    userRepository;
    userProfileRepository;
    hostnamesService;
    jwtService;
    constructor(userRepository, userProfileRepository, hostnamesService, jwtService) {
        this.userRepository = userRepository;
        this.userProfileRepository = userProfileRepository;
        this.hostnamesService = hostnamesService;
        this.jwtService = jwtService;
    }
    async register(createUserDto) {
        const { email, password, name, userProfile } = createUserDto;
        if (!email || !password) {
            throw new common_1.BadRequestException('Email y contraseña son requeridos');
        }
        const existingUser = await this.userRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new common_1.BadRequestException('El email ya está registrado');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = this.userRepository.create({
            email,
            password: hashedPassword,
            name: name?.trim() || null,
        });
        const savedUser = await this.userRepository.save(newUser);
        if (userProfile?.hostname_id) {
            const hostnameValue = userProfile.hostname_id.toLowerCase().trim();
            const hostnameRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
            if (!hostnameRegex.test(hostnameValue) || hostnameValue.length < 3 || hostnameValue.length > 63) {
                await this.userRepository.remove(savedUser);
                throw new common_1.BadRequestException('El hostname solo puede contener letras minúsculas, números y guiones (3-63 chars)');
            }
            const hostnameCheck = await this.hostnamesService.checkAvailability(hostnameValue);
            if (!hostnameCheck.available) {
                await this.userRepository.remove(savedUser);
                throw new common_1.BadRequestException('El hostname ya está en uso. Por favor elige otro.');
            }
            const hostname = await this.hostnamesService.registerWithUser(hostnameValue, savedUser.id);
            const newProfile = new entities_1.UserProfile();
            newProfile.usersId = savedUser.id;
            newProfile.document = userProfile.document;
            newProfile.phone = userProfile.phone;
            newProfile.companyName = userProfile.company_name;
            newProfile.hostnameId = hostname.id;
            newProfile.rucCompany = userProfile.ruc_company ?? '';
            await this.userProfileRepository.save(newProfile);
            const payload = { sub: savedUser.id, email: savedUser.email, role: savedUser.role || 'user' };
            const access_token = this.jwtService.sign(payload);
            return {
                success: true,
                message: 'Usuario registrado correctamente',
                access_token,
                user: {
                    id: savedUser.id,
                    email: savedUser.email,
                    role: savedUser.role || 'user',
                    name: savedUser.name ?? name ?? undefined,
                    userProfile: {
                        document: userProfile.document,
                        phone: userProfile.phone,
                        company_name: userProfile.company_name,
                        hostname_id: hostname.id,
                        hostname: hostname.hostname,
                    },
                },
            };
        }
        const payload = { sub: savedUser.id, email: savedUser.email, role: savedUser.role || 'user' };
        const access_token = this.jwtService.sign(payload);
        return {
            success: true,
            message: 'Usuario registrado correctamente',
            access_token,
            user: {
                id: savedUser.id,
                email: savedUser.email,
                role: savedUser.role || 'user',
                name,
            },
        };
    }
    async login(email, password) {
        if (!email || !password) {
            throw new common_1.UnauthorizedException('Email y contraseña son requeridos');
        }
        const user = await this.userRepository.findOne({
            where: { email },
        });
        if (user) {
            console.log('Backend AuthService - User found:', {
                id: user.id,
                email: user.email,
                role: user.role,
                allKeys: Object.keys(user)
            });
        }
        if (!user) {
            throw new common_1.UnauthorizedException('Email o contraseña incorrectos');
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            throw new common_1.UnauthorizedException('Email o contraseña incorrectos');
        }
        if (!user.role) {
            user.role = user.email === 'admin@eirl.pe' ? 'admin' : 'user';
        }
        const userProfile = await this.userProfileRepository.findOne({
            where: { usersId: user.id },
        });
        const payload = { sub: user.id, email: user.email, role: user.role };
        const access_token = this.jwtService.sign(payload);
        return {
            success: true,
            access_token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                name: user.name ?? undefined,
                userProfile: userProfile,
            },
        };
    }
    async getProfile(userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            select: ['id', 'email', 'name', 'role', 'companyName', 'document', 'phone', 'address', 'rucCompany'],
        });
        if (!user)
            return null;
        const firstProfile = await this.userProfileRepository.findOne({
            where: { usersId: userId },
            relations: ['hostname'],
            order: { id: 'ASC' },
        });
        const profilePayload = firstProfile
            ? {
                id: firstProfile.id,
                company_name: firstProfile.companyName ?? undefined,
                document: firstProfile.document ?? undefined,
                phone: firstProfile.phone ?? undefined,
                address: firstProfile.address ?? undefined,
                ruc_company: firstProfile.rucCompany ?? undefined,
                hostname: firstProfile.hostname?.hostname ?? undefined,
            }
            : {
                company_name: user.companyName ?? undefined,
                document: user.document ?? undefined,
                phone: user.phone ?? undefined,
                address: user.address ?? undefined,
                ruc_company: user.rucCompany ?? undefined,
            };
        return {
            id: user.id,
            email: user.email,
            name: user.name ?? undefined,
            role: user.role,
            profile: profilePayload,
        };
    }
    async updateProfile(userId, dto) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            select: ['id', 'email', 'name', 'password', 'role', 'companyName', 'document', 'phone', 'address', 'rucCompany'],
        });
        if (!user)
            throw new common_1.UnauthorizedException('Usuario no encontrado');
        if (dto.name !== undefined) {
            user.name = dto.name?.trim() || null;
        }
        if (dto.email !== undefined) {
            const email = dto.email.trim().toLowerCase();
            if (!email)
                throw new common_1.BadRequestException('El email no puede estar vacío');
            const existing = await this.userRepository.findOne({ where: { email } });
            if (existing && existing.id !== userId) {
                throw new common_1.BadRequestException('El email ya está en uso');
            }
            user.email = email;
        }
        if (dto.newPassword) {
            if (!dto.currentPassword) {
                throw new common_1.BadRequestException('La contraseña actual es requerida para cambiar la contraseña');
            }
            const match = await bcrypt.compare(dto.currentPassword, user.password);
            if (!match) {
                throw new common_1.BadRequestException('La contraseña actual no es correcta');
            }
            user.password = await bcrypt.hash(dto.newPassword, 10);
        }
        const profileFields = ['company_name', 'document', 'phone', 'address', 'ruc_company'];
        const hasProfileUpdate = profileFields.some((f) => dto[f] !== undefined);
        if (hasProfileUpdate) {
            const profile = await this.userProfileRepository.findOne({
                where: { usersId: userId },
                order: { id: 'ASC' },
            });
            if (profile) {
                if (dto.company_name !== undefined)
                    profile.companyName = dto.company_name?.trim() || undefined;
                if (dto.document !== undefined)
                    profile.document = dto.document?.trim() || undefined;
                if (dto.phone !== undefined)
                    profile.phone = dto.phone?.trim() || undefined;
                if (dto.address !== undefined)
                    profile.address = dto.address?.trim() || undefined;
                if (dto.ruc_company !== undefined)
                    profile.rucCompany = dto.ruc_company?.trim() || undefined;
                await this.userProfileRepository.save(profile);
            }
            else {
                if (dto.company_name !== undefined)
                    user.companyName = dto.company_name?.trim() || null;
                if (dto.document !== undefined)
                    user.document = dto.document?.trim() || null;
                if (dto.phone !== undefined)
                    user.phone = dto.phone?.trim() || null;
                if (dto.address !== undefined)
                    user.address = dto.address?.trim() || null;
                if (dto.ruc_company !== undefined)
                    user.rucCompany = dto.ruc_company?.trim() || null;
            }
        }
        await this.userRepository.save(user);
        return this.getProfile(userId);
    }
    async getUserHostnames(userId) {
        const profiles = await this.userProfileRepository.find({
            where: { usersId: userId },
            relations: ['hostname'],
        });
        return profiles.map((p) => ({
            id: p.hostname?.id,
            hostname: p.hostname?.hostname,
            created_at: p.hostname?.createdAt,
            company_name: p.companyName,
            document: p.document,
            phone: p.phone,
        }));
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.UserProfile)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        hostnames_service_1.HostnamesService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map