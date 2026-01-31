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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const user_profile_entity_1 = require("./user-profile.entity");
const cobro_entity_1 = require("../entities/cobro.entity");
const template_user_personalization_entity_1 = require("./template-user-personalization.entity");
let User = class User {
    id;
    email;
    password;
    created_at;
    updated_at;
    userProfiles;
    cobros;
    templateUserPersonalizations;
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_profile_entity_1.UserProfile, (userProfile) => userProfile.user),
    __metadata("design:type", Array)
], User.prototype, "userProfiles", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => cobro_entity_1.Cobro, (cobro) => cobro.user),
    __metadata("design:type", Array)
], User.prototype, "cobros", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => template_user_personalization_entity_1.TemplateUserPersonalization, (templateUserPersonalization) => templateUserPersonalization.user),
    __metadata("design:type", Array)
], User.prototype, "templateUserPersonalizations", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('users'),
    (0, typeorm_1.Unique)(['email'])
], User);
//# sourceMappingURL=user.entity.js.map