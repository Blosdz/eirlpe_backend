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
exports.Hostname = void 0;
const typeorm_1 = require("typeorm");
const user_profile_entity_1 = require("./user-profile.entity");
const template_user_personalization_entity_1 = require("../entities/template-user-personalization.entity");
let Hostname = class Hostname {
    id;
    hostname;
    template_user_personalization;
    created_at;
    updated_at;
    userProfiles;
    templateUserPersonalizations;
};
exports.Hostname = Hostname;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Hostname.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Hostname.prototype, "hostname", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Hostname.prototype, "template_user_personalization", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Hostname.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Hostname.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_profile_entity_1.UserProfile, (userProfile) => userProfile.hostname),
    __metadata("design:type", Array)
], Hostname.prototype, "userProfiles", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => template_user_personalization_entity_1.TemplateUserPersonalization, (templateUserPersonalization) => templateUserPersonalization.hostname),
    __metadata("design:type", Array)
], Hostname.prototype, "templateUserPersonalizations", void 0);
exports.Hostname = Hostname = __decorate([
    (0, typeorm_1.Entity)('hostnames'),
    (0, typeorm_1.Unique)(['hostname'])
], Hostname);
//# sourceMappingURL=hostname.entity.js.map