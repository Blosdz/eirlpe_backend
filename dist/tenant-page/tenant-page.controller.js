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
exports.TenantPageController = void 0;
const common_1 = require("@nestjs/common");
const express = __importStar(require("express"));
const template_renderer_service_1 = require("./template-renderer.service");
const tenant_context_service_1 = require("../tenant/tenant-context.service");
const tenant_entities_1 = require("../tenant-entities");
const tenant_guard_1 = require("../tenant/guards/tenant.guard");
const require_tenant_decorator_1 = require("../tenant/decorators/require-tenant.decorator");
const MIME = {
    css: 'text/css; charset=utf-8',
    js: 'application/javascript; charset=utf-8',
};
let TenantPageController = class TenantPageController {
    renderer;
    tenantCtx;
    constructor(renderer, tenantCtx) {
        this.renderer = renderer;
        this.tenantCtx = tenantCtx;
    }
    async renderPage(res) {
        const config = await this.getConfig();
        const templateId = config?.templateId;
        if (!templateId) {
            throw new common_1.BadRequestException('Este tenant no tiene un template configurado. Configúralo en PUT /api/tenant-config');
        }
        if (!this.renderer.templateExists(templateId)) {
            throw new common_1.NotFoundException(`Template '${templateId}' no existe en el servidor`);
        }
        const customization = (config.customization ?? {});
        const hostname = this.tenantCtx.getHostname();
        const assetBaseUrl = `/api/tenant-page/assets/${templateId}`;
        const html = this.renderer.render(templateId, customization, assetBaseUrl);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('X-Tenant', hostname ?? '');
        res.setHeader('Cache-Control', 'no-cache');
        res.send(html);
    }
    serveAsset(templateId, filename, res) {
        const ext = filename.split('.').pop()?.toLowerCase() ?? '';
        if (!['css', 'js'].includes(ext)) {
            throw new common_1.BadRequestException('Solo se sirven archivos .css y .js');
        }
        const content = this.renderer.readAsset(templateId, filename);
        const mime = MIME[ext] ?? 'text/plain';
        res.setHeader('Content-Type', mime);
        res.setHeader('Cache-Control', 'public, max-age=3600');
        res.send(content);
    }
    listTemplates() {
        return { templates: this.renderer.listTemplates() };
    }
    async getConfig() {
        const connection = this.tenantCtx.getConnection();
        if (!connection)
            return null;
        const repo = connection.getRepository(tenant_entities_1.TenantConfig);
        return repo.findOne({ where: { isActive: true } });
    }
};
exports.TenantPageController = TenantPageController;
__decorate([
    (0, common_1.Get)(),
    (0, require_tenant_decorator_1.RequireTenant)(),
    (0, common_1.UseGuards)(tenant_guard_1.TenantGuard),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TenantPageController.prototype, "renderPage", null);
__decorate([
    (0, common_1.Get)('assets/:templateId/:filename'),
    __param(0, (0, common_1.Param)('templateId')),
    __param(1, (0, common_1.Param)('filename')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], TenantPageController.prototype, "serveAsset", null);
__decorate([
    (0, common_1.Get)('templates'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TenantPageController.prototype, "listTemplates", null);
exports.TenantPageController = TenantPageController = __decorate([
    (0, common_1.Controller)('tenant-page'),
    __metadata("design:paramtypes", [template_renderer_service_1.TemplateRendererService,
        tenant_context_service_1.TenantContextService])
], TenantPageController);
//# sourceMappingURL=tenant-page.controller.js.map