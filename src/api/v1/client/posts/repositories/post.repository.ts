import { inject } from 'inversify';
import { eq } from 'drizzle-orm';
import { posts } from '../../shared/db/schema';
import { Post, CreatePostDto, UpdatePostDto } from '../entities/post.entity';
import { BaseRepository } from '../../shared/repositories/base.repository';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { AutoRegister } from '../../../../decorators/auto-register.decorator';

type DatabaseSchema = {
  posts: typeof posts;
};

// Helper function to convert database nulls to undefined
const mapDbPostToPost = (dbPost: any): Post => ({
  ...dbPost
});

@AutoRegister({ autoBind: true })
export class PostRepository extends BaseRepository<Post> {
  constructor() {
    super('posts');
  }

  private posts: Post[] = [];

  async findAll(): Promise<Post[]> {
    return this.posts;
  }

  async findById(id: string): Promise<Post | undefined> {
    return this.posts.find(post => post.id === id);
  }

  async create(data: CreatePostDto): Promise<Post> {
    const newPost: Post = {
      id: this.generateId(),
      ...data,
      created_at: new Date(),
      updated_at: new Date()
    };
    
    this.posts.push(newPost);
    return newPost;
  }

  async update(id: string, data: UpdatePostDto): Promise<Post | undefined> {
    const index = this.posts.findIndex(post => post.id === id);
    
    if (index === -1) {
      return undefined;
    }
    
    const updatedPost: Post = {
      ...this.posts[index],
      ...data,
      updated_at: new Date()
    };
    
    this.posts[index] = updatedPost;
    return updatedPost;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.posts.findIndex(post => post.id === id);
    
    if (index === -1) {
      return false;
    }
    
    this.posts.splice(index, 1);
    return true;
  }

  async findByAuthorId(authorId: string): Promise<Post[]> {
    return this.posts.filter(post => post.author_id === authorId);
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
} 