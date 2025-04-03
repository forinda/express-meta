"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const postgres_js_1 = require("drizzle-orm/postgres-js");
const postgres_1 = __importDefault(require("postgres"));
const schema_1 = require("./schema");
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/express_meta';
const client = (0, postgres_1.default)(connectionString);
exports.db = (0, postgres_js_1.drizzle)(client, { schema: { users: schema_1.users } });
