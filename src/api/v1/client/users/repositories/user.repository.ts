import { inject } from 'inversify';
import { eq } from 'drizzle-orm';
import { users } from '../../shared/db/schema';
import { User, CreateUserDto, UpdateUserDto } from '../entities/user.entity';
import { BaseRepository } from '../../shared/repositories/base.repository';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { AutoRegister } from '../../../../decorators/auto-register.decorator';

type DatabaseSchema = {
  users: typeof users;
};

// Helper function to convert database nulls to undefined
const mapDbUserToUser = (dbUser: any): User => ({
  ...dbUser,
  age: dbUser.age === null ? undefined : dbUser.age
});

@AutoRegister({ autoBind: true })
export class UserRepository extends BaseRepository<User> {
  constructor() {
    super('users');
  }

  async findAll(): Promise<User[]> {
    return await this.withTransaction(async (tx) => {
      const dbUsers = await tx.select().from(users);
      return dbUsers.map(mapDbUserToUser);
    });
  }

  async findById(id: string): Promise<User | undefined> {
    return await this.withTransaction(async (tx) => {
      const [dbUser] = await tx.select().from(users).where(eq(users.id, id));
      return dbUser ? mapDbUserToUser(dbUser) : undefined;
    });
  }

  async create(data: CreateUserDto): Promise<User> {
    return await this.withTransaction(async (tx) => {
      const [dbUser] = await tx.insert(users).values(data).returning();
      return mapDbUserToUser(dbUser);
    });
  }

  async update(id: string, data: UpdateUserDto): Promise<User | undefined> {
    return await this.withTransaction(async (tx) => {
      const [dbUser] = await tx
        .update(users)
        .set({ ...data, updated_at: new Date() })
        .where(eq(users.id, id))
        .returning();
      return dbUser ? mapDbUserToUser(dbUser) : undefined;
    });
  }

  async delete(id: string): Promise<boolean> {
    return await this.withTransaction(async (tx) => {
      const [user] = await tx.delete(users).where(eq(users.id, id)).returning();
      return !!user;
    });
  }

  async createWithProfile(data: CreateUserDto, profileData: any): Promise<User> {
    return await this.withTransaction(async (tx) => {
      // Example of a complex transaction
      const [dbUser] = await tx.insert(users).values(data).returning();
      
      // Here you would insert profile data in another table
      // const [profile] = await tx.insert(profiles).values({
      //   userId: user.id,
      //   ...profileData
      // }).returning();

      return mapDbUserToUser(dbUser);
    });
  }
} 