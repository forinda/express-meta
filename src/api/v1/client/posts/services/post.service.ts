import { inject } from 'inversify';
import { PostRepository } from '../repositories/post.repository';
import { Post, CreatePostDto, UpdatePostDto } from '../entities/post.entity';
import { BaseService } from '../../shared/services/base.service';
import { AutoRegister } from '../../../../decorators/auto-register.decorator';

@AutoRegister({ autoBind: true })
export class PostService extends BaseService {
  constructor(
    @inject(PostRepository) private postRepository: PostRepository
  ) {
    super();
  }

  async getPosts(): Promise<Post[]> {
    return await this.withTransaction(async () => {
      return await this.postRepository.findAll();
    });
  }

  async getPostById(id: string): Promise<Post | undefined> {
    return await this.withTransaction(async () => {
      return await this.postRepository.findById(id);
    });
  }

  async createPost(data: CreatePostDto): Promise<Post> {
    return await this.withTransaction(async () => {
      return await this.postRepository.create(data);
    });
  }

  async updatePost(id: string, data: UpdatePostDto): Promise<Post | undefined> {
    return await this.withTransaction(async () => {
      return await this.postRepository.update(id, data);
    });
  }

  async deletePost(id: string): Promise<boolean> {
    return await this.withTransaction(async () => {
      return await this.postRepository.delete(id);
    });
  }

  // New methods for the controller
  async findAll(query: any): Promise<Post[]> {
    return await this.withTransaction(async () => {
      return await this.postRepository.findAll();
    });
  }

  async findById(id: string): Promise<Post | null> {
    return await this.withTransaction(async () => {
      const post = await this.postRepository.findById(id);
      return post || null;
    });
  }

  async create(data: Partial<Post>): Promise<Post> {
    return await this.withTransaction(async () => {
      return await this.postRepository.create(data as CreatePostDto);
    });
  }

  async update(id: string, data: Partial<Post>): Promise<Post | null> {
    return await this.withTransaction(async () => {
      const post = await this.postRepository.update(id, data as UpdatePostDto);
      return post || null;
    });
  }

  async delete(id: string): Promise<boolean> {
    return await this.withTransaction(async () => {
      return await this.postRepository.delete(id);
    });
  }

  async getPostsByAuthorId(authorId: string): Promise<Post[]> {
    return await this.withTransaction(async () => {
      return await this.postRepository.findByAuthorId(authorId);
    });
  }
} 