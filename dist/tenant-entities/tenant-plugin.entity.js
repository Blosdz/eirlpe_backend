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
exports.TenantPlugin = void 0;
const typeorm_1 = require("typeorm");
let TenantPlugin = class TenantPlugin {
    id;
    pluginKey;
    displayName;
    isActive;
    config;
    createdAt;
    updatedAt;
};
exports.TenantPlugin = TenantPlugin;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TenantPlugin.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, unique: true, name: 'plugin_key' }),
    __metadata("design:type", String)
], TenantPlugin.prototype, "pluginKey", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, name: 'display_name' }),
    __metadata("design:type", String)
], TenantPlugin.prototype, "displayName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false, name: 'is_active' }),
    __metadata("design:type", Boolean)
], TenantPlugin.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: '{}', name: 'config' }),
    __metadata("design:type", Object)
], TenantPlugin.prototype, "config", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], TenantPlugin.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], TenantPlugin.prototype, "updatedAt", void 0);
exports.TenantPlugin = TenantPlugin = __decorate([
    (0, typeorm_1.Entity)('tenant_plugins')
], TenantPlugin);
//# sourceMappingURL=tenant-plugin.entity.js.map