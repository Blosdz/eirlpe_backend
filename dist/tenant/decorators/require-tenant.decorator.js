"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptionalTenant = exports.RequireTenant = exports.REQUIRE_TENANT_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.REQUIRE_TENANT_KEY = 'requireTenant';
const RequireTenant = () => (0, common_1.SetMetadata)(exports.REQUIRE_TENANT_KEY, true);
exports.RequireTenant = RequireTenant;
const OptionalTenant = () => (0, common_1.SetMetadata)(exports.REQUIRE_TENANT_KEY, false);
exports.OptionalTenant = OptionalTenant;
//# sourceMappingURL=require-tenant.decorator.js.map