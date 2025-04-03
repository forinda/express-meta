import { inject } from 'tsyringe';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { db } from '../db/config';
import { users } from '../db/schema';

type DatabaseSchema = {
  users: typeof users;
};

export abstract class BaseRepository {
  constructor(
    @inject('Database') protected database: PostgresJsDatabase<DatabaseSchema> = db
  ) {}

  protected async withTransaction<T>(
    callback: (tx: PostgresJsDatabase<DatabaseSchema>) => Promise<T>
  ): Promise<T> {
    return await this.database.transaction(async (tx) => {
      return await callback(tx);
    });
  }
} 