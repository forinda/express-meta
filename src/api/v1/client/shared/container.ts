import { container } from 'tsyringe';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { db } from './db/config';
import { users } from './db/schema';

type DatabaseSchema = {
  users: typeof users;
};

// Register the database instance
container.register<PostgresJsDatabase<DatabaseSchema>>('Database', { useValue: db });

// Register repositories
import { UserRepository } from '../users/repositories/user.repository';
container.register('UserRepository', { useClass: UserRepository });

// Register services
import { UserService } from '../users/services/user.service';
container.register('UserService', { useClass: UserService }); 