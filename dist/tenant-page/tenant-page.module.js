"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantPageModule = void 0;
const common_1 = require("@nestjs/common");
const template_renderer_service_1 = require("./template-renderer.service");
const tenant_page_controller_1 = require("./tenant-page.controller");
const templates_selector_controller_1 = require("./templates-selector.controller");
let TenantPageModule = class TenantPageModule {
};
exports.TenantPageModule = TenantPageModule;
exports.TenantPageModule = TenantPageModule = __decorate([
    (0, common_1.Module)({
        controllers: [tenant_page_controller_1.TenantPageController, templates_selector_controller_1.TemplatesSelectorController],
        providers: [template_renderer_service_1.TemplateRendererService],
        exports: [template_renderer_service_1.TemplateRendererService],
    })
], TenantPageModule);
//# sourceMappingURL=tenant-page.module.js.map