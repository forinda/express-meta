import { Router } from 'express';
import { inject } from 'inversify';
import { UserService } from '../services/user.service';
import { ApiOperation, ApiResponse, ApiTags } from '../../../shared/decorators/swagger.decorator';
import { validate, validateQuery, validateParams } from '../../../shared/decorators/validation.decorator';
import { createUserSchema, updateUserSchema, querySchema, paramsSchema } from '../schemas/user.schema';
import { formatError, formatResponse } from '../../../shared/utils/response.utils';
import { AutoRegister } from '../../../../decorators/auto-register.decorator';

@AutoRegister({ autoBind: true })
@ApiTags('Users')
export class UserController {
  public router!: Router;
  public path!: string;

  constructor(
    @inject(UserService) private userService: UserService
  ) {
    this.router = Router();
    this.path = '/users';
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.get('/', this.getUsers.bind(this));
    this.router.post('/', this.createUser.bind(this));
    this.router.get('/:id', this.getUserById.bind(this));
    this.router.put('/:id', this.updateUser.bind(this));
    this.router.delete('/:id', this.deleteUser.bind(this));
  }

  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieve a list of all users with optional pagination and filtering'
  })
  @ApiResponse(200, 'Successfully retrieved users')
  @validateQuery(querySchema)
  private async getUsers(req: any, res: any): Promise<void> {
    try {
      const users = await this.userService.findAll(req.query);
      res.json(formatResponse(users));
    } catch (error) {
      res.status(500).json(formatError(error));
    }
  }

  @ApiOperation({
    summary: 'Create a new user',
    description: 'Create a new user with the provided data'
  })
  @ApiResponse(201, 'User created successfully')
  @ApiResponse(400, 'Invalid input data')
  @validate(createUserSchema)
  private async createUser(req: any, res: any): Promise<void> {
    try {
      const user = await this.userService.create(req.body);
      res.status(201).json(formatResponse(user));
    } catch (error) {
      res.status(400).json(formatError(error));
    }
  }

  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Retrieve a specific user by their ID'
  })
  @ApiResponse(200, 'Successfully retrieved user')
  @ApiResponse(404, 'User not found')
  @validateParams(paramsSchema)
  private async getUserById(req: any, res: any): Promise<void> {
    try {
      const user = await this.userService.findById(req.params.id);
      if (!user) {
        res.status(404).json(formatError({ message: 'User not found' }));
        return;
      }
      res.json(formatResponse(user));
    } catch (error) {
      res.status(500).json(formatError(error));
    }
  }

  @ApiOperation({
    summary: 'Update user',
    description: 'Update an existing user with the provided data'
  })
  @ApiResponse(200, 'User updated successfully')
  @ApiResponse(404, 'User not found')
  @validateParams(paramsSchema)
  @validate(updateUserSchema)
  private async updateUser(req: any, res: any): Promise<void> {
    try {
      const user = await this.userService.update(req.params.id, req.body);
      if (!user) {
        res.status(404).json(formatError({ message: 'User not found' }));
        return;
      }
      res.json(formatResponse(user));
    } catch (error) {
      res.status(500).json(formatError(error));
    }
  }

  @ApiOperation({
    summary: 'Delete user',
    description: 'Delete an existing user by their ID'
  })
  @ApiResponse(200, 'User deleted successfully')
  @ApiResponse(404, 'User not found')
  @validateParams(paramsSchema)
  private async deleteUser(req: any, res: any): Promise<void> {
    try {
      const success = await this.userService.delete(req.params.id);
      if (!success) {
        res.status(404).json(formatError({ message: 'User not found' }));
        return;
      }
      res.json(formatResponse({ message: 'User deleted successfully' }));
    } catch (error) {
      res.status(500).json(formatError(error));
    }
  }
} 