"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantUsersModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
const tenant_users_service_1 = require("./tenant-users.service");
const tenant_users_controller_1 = require("./tenant-users.controller");
const tenant_jwt_strategy_1 = require("./strategies/tenant-jwt.strategy");
let TenantUsersModule = class TenantUsersModule {
};
exports.TenantUsersModule = TenantUsersModule;
exports.TenantUsersModule = TenantUsersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    secret: configService.get('TENANT_JWT_SECRET', 'tenant-secret-key-2026'),
                    signOptions: {
                        expiresIn: configService.get('TENANT_JWT_EXPIRES_IN', '8h'),
                    },
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        controllers: [tenant_users_controller_1.TenantUsersController],
        providers: [tenant_users_service_1.TenantUsersService, tenant_jwt_strategy_1.TenantJwtStrategy],
        exports: [tenant_users_service_1.TenantUsersService],
    })
], TenantUsersModule);
//# sourceMappingURL=tenant-users.module.js.map