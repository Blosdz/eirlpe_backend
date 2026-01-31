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
exports.TemplatesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Handlebars = __importStar(require("handlebars"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const template_entity_1 = require("../entities/template.entity");
const hostname_entity_1 = require("../entities/hostname.entity");
const template_user_personalization_entity_1 = require("../entities/template-user-personalization.entity");
let TemplatesService = class TemplatesService {
    templateRepository;
    hostnameRepository;
    templateUserPersonalizationRepository;
    constructor(templateRepository, hostnameRepository, templateUserPersonalizationRepository) {
        this.templateRepository = templateRepository;
        this.hostnameRepository = hostnameRepository;
        this.templateUserPersonalizationRepository = templateUserPersonalizationRepository;
        this.registerHandlebarsHelpers();
    }
    registerHandlebarsHelpers() {
        Handlebars.registerHelper('if', function (conditional, options) {
            if (conditional) {
                return options.fn(this);
            }
            else {
                return options.inverse(this);
            }
        });
        Handlebars.registerHelper('each', function (context, options) {
            let ret = '';
            for (let i = 0; i < context.length; i++) {
                ret = ret + options.fn(context[i]);
            }
            return ret;
        });
    }
    async findAll() {
        return this.templateRepository.find();
    }
    async findById(id) {
        const template = await this.templateRepository.findOne({ where: { id } });
        if (!template) {
            throw new common_1.NotFoundException(`Template with ID ${id} not found`);
        }
        return template;
    }
    async renderTemplate(hostname) {
        const hostnameRecord = await this.hostnameRepository.findOne({
            where: { hostname: hostname.toLowerCase() },
            relations: ['templateUserPersonalizations'],
        });
        if (!hostnameRecord) {
            throw new common_1.NotFoundException(`Hostname ${hostname} not found`);
        }
        let templateData;
        let templateFolder;
        if (hostnameRecord.templateUserPersonalizations?.length > 0) {
            const personalization = hostnameRecord.templateUserPersonalizations[0];
            const baseTemplate = await this.templateRepository.findOne({
                where: { id: personalization.template_id },
            });
            if (!baseTemplate) {
                throw new common_1.NotFoundException('Template not found');
            }
            templateFolder = baseTemplate.folder_template;
            const baseData = JSON.parse(baseTemplate.template_json);
            const customData = JSON.parse(personalization.template_json_personalization);
            templateData = this.mergeTemplateData(baseData, customData);
        }
        else {
            const defaultTemplate = await this.templateRepository.findOne({
                where: { id: 1 },
            });
            if (!defaultTemplate) {
                throw new common_1.NotFoundException('Default template not found');
            }
            templateFolder = defaultTemplate.folder_template;
            templateData = JSON.parse(defaultTemplate.template_json);
        }
        const templatePath = path.join(__dirname, '../../src/customPages', templateFolder, 'index.html');
        if (!fs.existsSync(templatePath)) {
            throw new common_1.NotFoundException(`Template file not found: ${templatePath}`);
        }
        const templateSource = fs.readFileSync(templatePath, 'utf-8');
        const template = Handlebars.compile(templateSource);
        const renderedHtml = template(templateData);
        return renderedHtml;
    }
    async createPersonalization(hostnameId, userId, templateId, customData) {
        let personalization = await this.templateUserPersonalizationRepository.findOne({
            where: {
                hostname_id: hostnameId,
                user_id: userId,
            },
        });
        if (personalization) {
            personalization.template_id = templateId;
            personalization.template_json_personalization = JSON.stringify(customData);
        }
        else {
            personalization = this.templateUserPersonalizationRepository.create({
                hostname_id: hostnameId,
                user_id: userId,
                template_id: templateId,
                template_json_personalization: JSON.stringify(customData),
                cobros_available: false,
            });
        }
        return this.templateUserPersonalizationRepository.save(personalization);
    }
    async getPersonalization(hostnameId, userId) {
        return this.templateUserPersonalizationRepository.findOne({
            where: {
                hostname_id: hostnameId,
                user_id: userId,
            },
            relations: ['template'],
        });
    }
    mergeTemplateData(base, custom) {
        const merged = { ...base };
        if (custom.sections) {
            merged.sections = {
                ...base.sections,
                ...custom.sections,
            };
            for (const key in custom.sections) {
                if (base.sections[key]) {
                    merged.sections[key] = {
                        ...base.sections[key],
                        ...custom.sections[key],
                    };
                }
            }
        }
        if (custom.theme) {
            merged.theme = {
                ...base.theme,
                ...custom.theme,
            };
        }
        if (custom.companyName) {
            merged.companyName = custom.companyName;
        }
        return merged;
    }
};
exports.TemplatesService = TemplatesService;
exports.TemplatesService = TemplatesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(template_entity_1.Template)),
    __param(1, (0, typeorm_1.InjectRepository)(hostname_entity_1.Hostname)),
    __param(2, (0, typeorm_1.InjectRepository)(template_user_personalization_entity_1.TemplateUserPersonalization)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], TemplatesService);
//# sourceMappingURL=templates.service.js.map