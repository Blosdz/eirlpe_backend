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
exports.TemplatesSelectorController = void 0;
const common_1 = require("@nestjs/common");
const express = __importStar(require("express"));
const template_renderer_service_1 = require("./template-renderer.service");
let TemplatesSelectorController = class TemplatesSelectorController {
    renderer;
    constructor(renderer) {
        this.renderer = renderer;
    }
    list() {
        return { templates: this.renderer.listTemplatesWithMeta() };
    }
    preview(id, res) {
        if (!this.renderer.templateExists(id)) {
            throw new common_1.NotFoundException(`Template '${id}' no existe`);
        }
        const assetBaseUrl = `/api/templates-selector/preview/${id}/assets`;
        const html = this.renderer.renderPreview(id, assetBaseUrl);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Cache-Control', 'public, max-age=300');
        res.send(html);
    }
    previewAsset(id, filename, res) {
        const ext = filename.split('.').pop()?.toLowerCase() ?? '';
        if (!['css', 'js'].includes(ext)) {
            return res.status(400).send('Solo .css y .js');
        }
        const content = this.renderer.readAsset(id, filename);
        const mime = ext === 'css' ? 'text/css; charset=utf-8' : 'application/javascript; charset=utf-8';
        res.setHeader('Content-Type', mime);
        res.setHeader('Cache-Control', 'public, max-age=3600');
        res.send(content);
    }
};
exports.TemplatesSelectorController = TemplatesSelectorController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TemplatesSelectorController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('preview/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TemplatesSelectorController.prototype, "preview", null);
__decorate([
    (0, common_1.Get)('preview/:id/assets/:filename'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('filename')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], TemplatesSelectorController.prototype, "previewAsset", null);
exports.TemplatesSelectorController = TemplatesSelectorController = __decorate([
    (0, common_1.Controller)('templates-selector'),
    __metadata("design:paramtypes", [template_renderer_service_1.TemplateRendererService])
], TemplatesSelectorController);
//# sourceMappingURL=templates-selector.controller.js.map