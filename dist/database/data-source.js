"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const entities_1 = require("../entities");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'blink182',
    database: process.env.DB_NAME || 'eirl',
    schema: process.env.DB_SCHEMA || 'eirl',
    entities: [entities_1.Hostname, entities_1.User, entities_1.UserProfile, entities_1.Template, entities_1.TemplateUserPersonalization, entities_1.Cobro],
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV !== 'production',
    migrations: ['src/database/migrations/*.ts'],
    migrationsTableName: 'migrations',
});
//# sourceMappingURL=data-source.js.map