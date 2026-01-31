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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("typeorm");
const hostnames_service_1 = require("../hostnames/hostnames.service");
const bcrypt = __importStar(require("bcrypt"));
let AuthService = class AuthService {
    dataSource;
    hostnamesService;
    jwtService;
    constructor(dataSource, hostnamesService, jwtService) {
        this.dataSource = dataSource;
        this.hostnamesService = hostnamesService;
        this.jwtService = jwtService;
    }
    async register(createUserDto) {
        const { email, password, name, userProfile } = createUserDto;
        try {
            if (!email || !password) {
                throw new common_1.BadRequestException('Email y contraseña son requeridos');
            }
            if (!userProfile.hostname_id) {
                throw new common_1.BadRequestException('El hostname es requerido');
            }
            const hostnameValue = userProfile.hostname_id.toLowerCase().trim();
            const hostnameRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
            if (!hostnameRegex.test(hostnameValue)) {
                throw new common_1.BadRequestException('El hostname solo puede contener letras minúsculas, números y guiones. No puede comenzar ni terminar con un guión.');
            }
            if (hostnameValue.length < 3 || hostnameValue.length > 63) {
                throw new common_1.BadRequestException('El hostname debe tener entre 3 y 63 caracteres');
            }
            const existingUser = await this.dataSource.query('SELECT * FROM users WHERE email = $1', [email]);
            if (existingUser.length > 0) {
                throw new common_1.BadRequestException('El email ya está registrado');
            }
            const hostnameCheck = await this.hostnamesService.checkAvailability(hostnameValue);
            if (!hostnameCheck.available) {
                throw new common_1.BadRequestException('El hostname ya está en uso. Por favor elige otro.');
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const userResult = await this.dataSource.query('INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *', [email, hashedPassword]);
            const userId = userResult[0].id;
            const hostname = await this.hostnamesService.registerWithUser(hostnameValue, userId);
            await this.dataSource.query(`INSERT INTO user_profile (users_id, document, phone, company_name, hostname_id)
         VALUES ($1, $2, $3, $4, $5)`, [
                userId,
                userProfile.document || null,
                userProfile.phone || null,
                userProfile.company_name || null,
                hostname.id,
            ]);
            const payload = { sub: userId, email: email };
            const access_token = this.jwtService.sign(payload);
            return {
                success: true,
                message: 'Usuario registrado correctamente',
                access_token,
                user: {
                    id: userId,
                    email: email,
                    name: name,
                    userProfile: {
                        document: userProfile.document || null,
                        phone: userProfile.phone || null,
                        company_name: userProfile.company_name || null,
                        hostname_id: hostname.id,
                        hostname: hostname.hostname,
                    },
                },
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message || 'Error al registrar usuario');
        }
    }
    async login(email, password) {
        try {
            if (!email || !password) {
                throw new common_1.UnauthorizedException('Email y contraseña son requeridos');
            }
            const userResult = await this.dataSource.query('SELECT id, email, password FROM users WHERE email = $1', [email]);
            if (userResult.length === 0) {
                throw new common_1.UnauthorizedException('Email o contraseña incorrectos');
            }
            const user = userResult[0];
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                throw new common_1.UnauthorizedException('Email o contraseña incorrectos');
            }
            const profileResult = await this.dataSource.query(`SELECT id, document, phone, company_name, hostname_id 
         FROM user_profile 
         WHERE users_id = $1 LIMIT 1`, [user.id]);
            const userProfile = profileResult.length > 0 ? profileResult[0] : null;
            const payload = { sub: user.id, email: user.email };
            const access_token = this.jwtService.sign(payload);
            return {
                success: true,
                access_token,
                user: {
                    id: user.id,
                    email: user.email,
                    userProfile: userProfile,
                },
            };
        }
        catch (error) {
            throw new common_1.UnauthorizedException(error.message || 'Error al iniciar sesión');
        }
    }
    async getUserHostnames(userId) {
        try {
            const hostnames = await this.dataSource.query(`SELECT h.id, h.hostname, h.created_at, up.company_name, up.document, up.phone
         FROM hostnames h
         JOIN user_profile up ON h.id = up.hostname_id
         JOIN users u ON up.users_id = u.id
         WHERE u.id = $1
         ORDER BY h.created_at DESC`, [userId]);
            return hostnames;
        }
        catch (error) {
            throw new common_1.BadRequestException('Error al obtener hostnames');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource,
        hostnames_service_1.HostnamesService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map