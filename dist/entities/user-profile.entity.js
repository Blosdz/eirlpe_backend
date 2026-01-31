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
exports.UserProfile = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const hostname_entity_1 = require("./hostname.entity");
const template_user_personalization_entity_1 = require("./template-user-personalization.entity");
let UserProfile = class UserProfile {
    id;
    users_id;
    document;
    phone;
    company_name;
    hostname_id;
    template_user_id;
    created_at;
    updated_at;
    user;
    hostname;
    templateUserPersonalization;
};
exports.UserProfile = UserProfile;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], UserProfile.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], UserProfile.prototype, "users_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], UserProfile.prototype, "document", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], UserProfile.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], UserProfile.prototype, "company_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], UserProfile.prototype, "hostname_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], UserProfile.prototype, "template_user_id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], UserProfile.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], UserProfile.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.userProfiles, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'users_id' }),
    __metadata("design:type", user_entity_1.User)
], UserProfile.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => hostname_entity_1.Hostname, (hostname) => hostname.userProfiles, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'hostname_id' }),
    __metadata("design:type", hostname_entity_1.Hostname)
], UserProfile.prototype, "hostname", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => template_user_personalization_entity_1.TemplateUserPersonalization, (templateUserPersonalization) => templateUserPersonalization.userProfiles, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'template_user_id' }),
    __metadata("design:type", template_user_personalization_entity_1.TemplateUserPersonalization)
], UserProfile.prototype, "templateUserPersonalization", void 0);
exports.UserProfile = UserProfile = __decorate([
    (0, typeorm_1.Entity)('user_profile'),
    (0, typeorm_1.Unique)('unique_user_hostname', ['user', 'hostname'])
], UserProfile);
//# sourceMappingURL=user-profile.entity.js.map