"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const postgres_js_1 = require("drizzle-orm/postgres-js");
const migrator_1 = require("drizzle-orm/postgres-js/migrator");
const postgres_1 = __importDefault(require("postgres"));
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/express_meta';
// For migrations
const migrationClient = (0, postgres_1.default)(connectionString, { max: 1 });
async function main() {
    try {
        await (0, migrator_1.migrate)((0, postgres_js_1.drizzle)(migrationClient), {
            migrationsFolder: './drizzle',
        });
        console.log('Migration completed successfully');
        process.exit(0);
    }
    catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}
main();
