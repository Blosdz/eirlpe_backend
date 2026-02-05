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
exports.TenantContextService = void 0;
const common_1 = require("@nestjs/common");
const async_hooks_1 = require("async_hooks");
const tenant_constants_1 = require("./tenant.constants");
let TenantContextService = class TenantContextService {
    asyncLocalStorage;
    constructor(asyncLocalStorage) {
        this.asyncLocalStorage = asyncLocalStorage;
    }
    getTenantContext() {
        return this.asyncLocalStorage.getStore();
    }
    getTenantId() {
        return this.asyncLocalStorage.getStore()?.tenantId;
    }
    getHostname() {
        return this.asyncLocalStorage.getStore()?.hostname;
    }
    getConnection() {
        return this.asyncLocalStorage.getStore()?.connection;
    }
    run(context, callback) {
        return this.asyncLocalStorage.run(context, callback);
    }
    runAsync(context, callback) {
        return this.asyncLocalStorage.run(context, callback);
    }
};
exports.TenantContextService = TenantContextService;
exports.TenantContextService = TenantContextService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(tenant_constants_1.TENANT_CONTEXT)),
    __metadata("design:paramtypes", [async_hooks_1.AsyncLocalStorage])
], TenantContextService);
//# sourceMappingURL=tenant-context.service.js.map