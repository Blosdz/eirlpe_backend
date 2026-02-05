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
exports.TenantUsersService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const tenant_context_service_1 = require("../tenant/tenant-context.service");
const tenant_entities_1 = require("../tenant-entities");
let TenantUsersService = class TenantUsersService {
    tenantContextService;
    jwtService;
    constructor(tenantContextService, jwtService) {
        this.tenantContextService = tenantContextService;
        this.jwtService = jwtService;
    }
    getRepository() {
        const connection = this.tenantContextService.getConnection();
        if (!connection) {
            throw new common_1.BadRequestException('Tenant connection not available');
        }
        return connection.getRepository(tenant_entities_1.TenantUser);
    }
    async register(dto) {
        const tenantId = this.tenantContextService.getTenantId();
        const hostname = this.tenantContextService.getHostname();
        if (!tenantId || !hostname) {
            throw new common_1.BadRequestException('Tenant not specified');
        }
        const repository = this.getRepository();
        const existing = await repository.findOne({
            where: { mail: dto.mail },
        });
        if (existing) {
            throw new common_1.BadRequestException('Email already registered');
        }
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = repository.create({
            mail: dto.mail,
            password: hashedPassword,
            name: dto.name,
            role: 'user',
            status: 'active',
        });
        const savedUser = await repository.save(user);
        const payload = {
            sub: savedUser.id,
            mail: savedUser.mail,
            tenantId,
            hostname,
            type: 'tenant_user',
        };
        return {
            user: {
                id: savedUser.id,
                mail: savedUser.mail,
                name: savedUser.name,
                role: savedUser.role,
            },
            access_token: this.jwtService.sign(payload),
        };
    }
    async login(dto) {
        const tenantId = this.tenantContextService.getTenantId();
        const hostname = this.tenantContextService.getHostname();
        if (!tenantId || !hostname) {
            throw new common_1.BadRequestException('Tenant not specified');
        }
        const repository = this.getRepository();
        const user = await repository.findOne({
            where: { mail: dto.mail },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (user.status !== 'active') {
            throw new common_1.UnauthorizedException('User inactive or suspended');
        }
        const passwordMatch = await bcrypt.compare(dto.password, user.password);
        if (!passwordMatch) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        user.lastLoginAt = new Date();
        await repository.save(user);
        const payload = {
            sub: user.id,
            mail: user.mail,
            tenantId,
            hostname,
            type: 'tenant_user',
        };
        return {
            user: {
                id: user.id,
                mail: user.mail,
                name: user.name,
                role: user.role,
            },
            access_token: this.jwtService.sign(payload),
        };
    }
    async findAll() {
        const repository = this.getRepository();
        const users = await repository.find({
            order: { createdAt: 'DESC' },
        });
        return users.map((user) => ({
            id: user.id,
            mail: user.mail,
            name: user.name,
            role: user.role,
            status: user.status,
            createdAt: user.createdAt,
            lastLoginAt: user.lastLoginAt,
        }));
    }
    async findById(id) {
        const repository = this.getRepository();
        const user = await repository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
    async findByMail(mail) {
        const repository = this.getRepository();
        return repository.findOne({ where: { mail } });
    }
    async updateStatus(id, status) {
        const user = await this.findById(id);
        user.status = status;
        const repository = this.getRepository();
        return repository.save(user);
    }
    async updateRole(id, role) {
        const user = await this.findById(id);
        user.role = role;
        const repository = this.getRepository();
        return repository.save(user);
    }
};
exports.TenantUsersService = TenantUsersService;
exports.TenantUsersService = TenantUsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_context_service_1.TenantContextService,
        jwt_1.JwtService])
], TenantUsersService);
//# sourceMappingURL=tenant-users.service.js.map