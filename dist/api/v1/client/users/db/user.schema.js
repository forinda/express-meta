"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRelations = exports.users = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const drizzle_1 = require("../../shared/utils/drizzle");
exports.users = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull(),
    email: (0, pg_core_1.varchar)('email', { length: 255 }).notNull().unique(),
    age: (0, pg_core_1.integer)('age'),
    last_login_at: (0, pg_core_1.timestamp)('last_login_at', { mode: 'string' }),
    ...(0, drizzle_1.getTableTimestamps)()
});
exports.userRelations = (0, drizzle_orm_1.relations)(exports.users, ({ many }) => ({
// Add relations here as needed
// For example:
// posts: many(Post, { relationName: 'author' })
}));
