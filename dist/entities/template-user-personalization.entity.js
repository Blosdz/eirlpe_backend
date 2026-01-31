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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateUserPersonalization = void 0;
const typeorm_1 = require("typeorm");
const hostname_entity_1 = require("./hostname.entity");
const user_entity_1 = require("./user.entity");
const template_entity_1 = require("./template.entity");
const user_profile_entity_1 = require("./user-profile.entity");
let TemplateUserPersonalization = class TemplateUserPersonalization {
    id;
    hostname_id;
    user_id;
    template_id;
    template_json_personalization;
    cobros_available;
    created_at;
    updated_at;
    hostname;
    user;
    template;
    userProfiles;
};
exports.TemplateUserPersonalization = TemplateUserPersonalization;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TemplateUserPersonalization.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], TemplateUserPersonalization.prototype, "hostname_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], TemplateUserPersonalization.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], TemplateUserPersonalization.prototype, "template_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], TemplateUserPersonalization.prototype, "template_json_personalization", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], TemplateUserPersonalization.prototype, "cobros_available", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], TemplateUserPersonalization.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], TemplateUserPersonalization.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => hostname_entity_1.Hostname, (hostname) => hostname.templateUserPersonalizations, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'hostname_id' }),
    __metadata("design:type", hostname_entity_1.Hostname)
], TemplateUserPersonalization.prototype, "hostname", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.templateUserPersonalizations, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], TemplateUserPersonalization.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => template_entity_1.Template, (template) => template.templateUserPersonalizations, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'template_id' }),
    __metadata("design:type", template_entity_1.Template)
], TemplateUserPersonalization.prototype, "template", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_profile_entity_1.UserProfile, (userProfile) => userProfile.templateUserPersonalization),
    __metadata("design:type", Array)
], TemplateUserPersonalization.prototype, "userProfiles", void 0);
exports.TemplateUserPersonalization = TemplateUserPersonalization = __decorate([
    (0, typeorm_1.Entity)('template_user_personalization'),
    (0, typeorm_1.Unique)('unique_user_template', ['hostname', 'user', 'template'])
], TemplateUserPersonalization);
//# sourceMappingURL=template-user-personalization.entity.js.map