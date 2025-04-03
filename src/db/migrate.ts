import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/express_meta';

// For migrations
const migrationClient = postgres(connectionString, { max: 1 });

async function main() {
  try {
    await migrate(drizzle(migrationClient), {
      migrationsFolder: './drizzle',
    });
    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

main(); 