import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { users } from './schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

type DatabaseSchema = {
  users: typeof users;
};

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/express_meta';

const client = postgres(connectionString);
export const db = drizzle(client, { schema: { users } }) as PostgresJsDatabase<DatabaseSchema>; 