import { integer, pgTable, unique, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { relations } from 'drizzle-orm';
import { getTableTimestamps } from '@/api/v1/client/shared/utils/drizzle';

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    age: integer('age'),
    last_login_at: timestamp('last_login_at', { mode: 'string' }),
    ...getTableTimestamps()
  }
);

export const userRelations = relations(users, ({ many }) => ({
  // Add relations here as needed
  // For example:
  // posts: many(Post, { relationName: 'author' })
}));

export interface SelectUserType extends InferSelectModel<typeof users> {}

export interface InsertUserType extends InferInsertModel<typeof users> {} 