import { injectable } from 'tsyringe';
import { db } from '../db/config';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  createdAt: Date;
  updatedAt: Date;
}

@injectable()
export class UserService {
  async getUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async addUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async getUserById(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async updateUser(id: string, data: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  async deleteUser(id: string): Promise<boolean> {
    const [deletedUser] = await db.delete(users).where(eq(users.id, id)).returning();
    return !!deletedUser;
  }
} 