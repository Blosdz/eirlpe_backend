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
exports.TenantMiddleware = void 0;
const common_1 = require("@nestjs/common");
const async_hooks_1 = require("async_hooks");
const tenant_service_1 = require("../tenant.service");
const tenant_connection_service_1 = require("../tenant-connection.service");
const tenant_constants_1 = require("../tenant.constants");
function extractSubdomain(raw) {
    const withoutPort = raw.split(':')[0];
    return withoutPort.split('.')[0].toLowerCase().trim();
}
let TenantMiddleware = class TenantMiddleware {
    tenantService;
    tenantConnectionService;
    asyncLocalStorage;
    constructor(tenantService, tenantConnectionService, asyncLocalStorage) {
        this.tenantService = tenantService;
        this.tenantConnectionService = tenantConnectionService;
        this.asyncLocalStorage = asyncLocalStorage;
    }
    async use(req, res, next) {
        const raw = req.headers[tenant_constants_1.TENANT_HEADER] || req.query.tenant;
        if (!raw) {
            return next();
        }
        const hostname = extractSubdomain(raw);
        const tenant = await this.tenantService.resolveHostname(hostname);
        if (!tenant) {
            return next();
        }
        try {
            const connection = await this.tenantConnectionService.getConnection(hostname);
            const tenantContext = {
                tenantId: tenant.id,
                hostname: tenant.hostname,
                connection,
                resolvedAt: new Date(),
            };
            req.tenant = tenantContext;
            this.asyncLocalStorage.run(tenantContext, () => {
                next();
            });
        }
        catch (error) {
            return next();
        }
    }
};
exports.TenantMiddleware = TenantMiddleware;
exports.TenantMiddleware = TenantMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)(tenant_constants_1.TENANT_CONTEXT)),
    __metadata("design:paramtypes", [tenant_service_1.TenantService,
        tenant_connection_service_1.TenantConnectionService,
        async_hooks_1.AsyncLocalStorage])
], TenantMiddleware);
//# sourceMappingURL=tenant.middleware.js.map