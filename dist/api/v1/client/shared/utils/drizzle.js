"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.foreignKeyConstraints = void 0;
exports.getTableTimestamps = getTableTimestamps;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const createdTimestamps = (0, pg_core_1.timestamp)('created_at', { mode: 'string' })
    .notNull()
    .defaultNow();
const updatedTimestamps = (0, pg_core_1.timestamp)('updated_at', {
    mode: 'string'
})
    .defaultNow()
    .$onUpdate(() => (0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`)
    .notNull();
const deletedTimestamps = (0, pg_core_1.timestamp)('deleted_at', { mode: 'string' });
function getTableTimestamps() {
    return {
        created_at: createdTimestamps,
        updated_at: updatedTimestamps,
        deleted_at: deletedTimestamps
    };
}
exports.foreignKeyConstraints = {
    onDelete: 'restrict',
    onUpdate: 'cascade'
};
