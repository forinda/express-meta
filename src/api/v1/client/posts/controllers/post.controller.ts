import { Router } from 'express';
import { inject } from 'inversify';
import { PostService } from '../services/post.service';
import { ApiOperation, ApiResponse, ApiTags } from '../../../shared/decorators/swagger.decorator';
import { validate, validateQuery, validateParams } from '../../../shared/decorators/validation.decorator';
import { createPostSchema, updatePostSchema, querySchema, paramsSchema } from '../schemas/post.schema';
import { formatError, formatResponse } from '../../../shared/utils/response.utils';
import { AutoRegister } from '../../../../decorators/auto-register.decorator';

@AutoRegister({ autoBind: true })
@ApiTags('Posts')
export class PostController {
  public router!: Router;
  public path!: string;

  constructor(
    @inject(PostService) private postService: PostService
  ) {
    this.router = Router();
    this.path = '/posts';
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.get('/', this.getPosts.bind(this));
    this.router.post('/', this.createPost.bind(this));
    this.router.get('/:id', this.getPostById.bind(this));
    this.router.put('/:id', this.updatePost.bind(this));
    this.router.delete('/:id', this.deletePost.bind(this));
  }

  @ApiOperation({
    summary: 'Get all posts',
    description: 'Retrieve a list of all posts with optional pagination and filtering'
  })
  @ApiResponse(200, 'Successfully retrieved posts')
  @validateQuery(querySchema)
  private async getPosts(req: any, res: any): Promise<void> {
    try {
      const posts = await this.postService.findAll(req.query);
      res.json(formatResponse(posts));
    } catch (error) {
      res.status(500).json(formatError(error));
    }
  }

  @ApiOperation({
    summary: 'Create a new post',
    description: 'Create a new post with the provided data'
  })
  @ApiResponse(201, 'Post created successfully')
  @ApiResponse(400, 'Invalid input data')
  @validate(createPostSchema)
  private async createPost(req: any, res: any): Promise<void> {
    try {
      const post = await this.postService.create(req.body);
      res.status(201).json(formatResponse(post));
    } catch (error) {
      res.status(400).json(formatError(error));
    }
  }

  @ApiOperation({
    summary: 'Get post by ID',
    description: 'Retrieve a specific post by its ID'
  })
  @ApiResponse(200, 'Successfully retrieved post')
  @ApiResponse(404, 'Post not found')
  @validateParams(paramsSchema)
  private async getPostById(req: any, res: any): Promise<void> {
    try {
      const post = await this.postService.findById(req.params.id);
      if (!post) {
        res.status(404).json(formatError({ message: 'Post not found' }));
        return;
      }
      res.json(formatResponse(post));
    } catch (error) {
      res.status(500).json(formatError(error));
    }
  }

  @ApiOperation({
    summary: 'Update post',
    description: 'Update an existing post with the provided data'
  })
  @ApiResponse(200, 'Post updated successfully')
  @ApiResponse(404, 'Post not found')
  @validateParams(paramsSchema)
  @validate(updatePostSchema)
  private async updatePost(req: any, res: any): Promise<void> {
    try {
      const post = await this.postService.update(req.params.id, req.body);
      if (!post) {
        res.status(404).json(formatError({ message: 'Post not found' }));
        return;
      }
      res.json(formatResponse(post));
    } catch (error) {
      res.status(500).json(formatError(error));
    }
  }

  @ApiOperation({
    summary: 'Delete post',
    description: 'Delete an existing post by its ID'
  })
  @ApiResponse(200, 'Post deleted successfully')
  @ApiResponse(404, 'Post not found')
  @validateParams(paramsSchema)
  private async deletePost(req: any, res: any): Promise<void> {
    try {
      const success = await this.postService.delete(req.params.id);
      if (!success) {
        res.status(404).json(formatError({ message: 'Post not found' }));
        return;
      }
      res.json(formatResponse({ message: 'Post deleted successfully' }));
    } catch (error) {
      res.status(500).json(formatError(error));
    }
  }
} 