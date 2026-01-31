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
exports.SiteController = exports.TemplatesController = void 0;
const common_1 = require("@nestjs/common");
const templates_service_1 = require("./templates.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let TemplatesController = class TemplatesController {
    templatesService;
    constructor(templatesService) {
        this.templatesService = templatesService;
    }
    async getAllTemplates() {
        const templates = await this.templatesService.findAll();
        return {
            success: true,
            templates: templates.map((t) => ({
                id: t.id,
                name: t.folder_template,
                price: t.prices_stimation,
                preview: `/templates/${t.folder_template}/preview.jpg`,
            })),
        };
    }
    async getTemplateById(id) {
        const template = await this.templatesService.findById(id);
        return {
            success: true,
            template: {
                id: template.id,
                name: template.folder_template,
                price: template.prices_stimation,
                structure: JSON.parse(template.template_json),
            },
        };
    }
    async personalizeTemplate(body) {
        const personalization = await this.templatesService.createPersonalization(body.hostnameId, body.userId, body.templateId, body.customData);
        return {
            success: true,
            message: 'Template personalization saved successfully',
            personalization: {
                id: personalization.id,
                hostname_id: personalization.hostname_id,
                template_id: personalization.template_id,
            },
        };
    }
    async getPersonalization(hostnameId, userId) {
        const personalization = await this.templatesService.getPersonalization(hostnameId, userId);
        if (!personalization) {
            return {
                success: false,
                message: 'No personalization found',
            };
        }
        return {
            success: true,
            personalization: {
                id: personalization.id,
                hostname_id: personalization.hostname_id,
                template_id: personalization.template_id,
                customData: JSON.parse(personalization.template_json_personalization),
            },
        };
    }
};
exports.TemplatesController = TemplatesController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "getAllTemplates", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "getTemplateById", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('personalize'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "personalizeTemplate", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('personalize/:hostnameId/:userId'),
    __param(0, (0, common_1.Param)('hostnameId')),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "getPersonalization", null);
exports.TemplatesController = TemplatesController = __decorate([
    (0, common_1.Controller)('templates'),
    __metadata("design:paramtypes", [templates_service_1.TemplatesService])
], TemplatesController);
let SiteController = class SiteController {
    templatesService;
    constructor(templatesService) {
        this.templatesService = templatesService;
    }
    async renderSite(hostname, res) {
        try {
            const html = await this.templatesService.renderTemplate(hostname);
            res.status(common_1.HttpStatus.OK).send(html);
        }
        catch (error) {
            res.status(common_1.HttpStatus.NOT_FOUND).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Site Not Found</title>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-gray-100 flex items-center justify-center min-h-screen">
          <div class="text-center">
            <h1 class="text-6xl font-bold text-gray-800 mb-4">404</h1>
            <p class="text-2xl text-gray-600 mb-8">Sitio no encontrado</p>
            <p class="text-gray-500">El hostname "${hostname}" no existe o no ha sido configurado.</p>
            <a href="/" class="inline-block mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
              Volver al inicio
            </a>
          </div>
        </body>
        </html>
      `);
        }
    }
};
exports.SiteController = SiteController;
__decorate([
    (0, common_1.Get)(':hostname'),
    __param(0, (0, common_1.Param)('hostname')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SiteController.prototype, "renderSite", null);
exports.SiteController = SiteController = __decorate([
    (0, common_1.Controller)('site'),
    __metadata("design:paramtypes", [templates_service_1.TemplatesService])
], SiteController);
//# sourceMappingURL=templates.controller.js.map