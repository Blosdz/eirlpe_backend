"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const async_hooks_1 = require("async_hooks");
const entities_1 = require("../entities");
const tenant_service_1 = require("./tenant.service");
const tenant_context_service_1 = require("./tenant-context.service");
const tenant_connection_service_1 = require("./tenant-connection.service");
const tenant_constants_1 = require("./tenant.constants");
let TenantModule = class TenantModule {
};
exports.TenantModule = TenantModule;
exports.TenantModule = TenantModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([entities_1.Hostname])],
        providers: [
            tenant_service_1.TenantService,
            tenant_context_service_1.TenantContextService,
            tenant_connection_service_1.TenantConnectionService,
            {
                provide: tenant_constants_1.TENANT_CONTEXT,
                useValue: new async_hooks_1.AsyncLocalStorage(),
            },
        ],
        exports: [
            tenant_service_1.TenantService,
            tenant_context_service_1.TenantContextService,
            tenant_connection_service_1.TenantConnectionService,
            tenant_constants_1.TENANT_CONTEXT,
        ],
    })
], TenantModule);
//# sourceMappingURL=tenant.module.js.map