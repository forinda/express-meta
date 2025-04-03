import { z } from 'zod';
import { UserService } from '../services/UserService';
import { Controller, Get, Post, Put, Delete } from '../decorators/controller.decorator';
import { validate as ValidateBody, validateQuery as ValidateQuery, validateParams as ValidateParams } from '../decorators/validation.decorator';
import { ApiOperation, ApiTags, ApiResponse, ApiSecurity } from '../decorators/swagger.decorator';
import { RequestContext } from '../context/request.context';

const UserSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  age: z.number().min(18)
});

const UserUpdateSchema = UserSchema.partial();

const UserQuerySchema = z.object({
  page: z.number().default(1),
  limit: z.number().default(10)
});

const UserParamsSchema = z.object({
  id: z.string().uuid()
});

@Controller('/users')
@ApiTags('Users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieves a list of all users with pagination',
    tags:['users','users-list']
  })
  @ApiResponse({
    status: 200,
    description: 'List of users'
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized'
  })
  @ValidateQuery(UserQuerySchema)
  async getUsers(context: RequestContext) {
    try {
      const users = await this.userService.getUsers();
      const { page, limit } = context.query;
      const start = (page - 1) * limit;
      const paginatedUsers = users.slice(start, start + limit);
      
      context.response.json({
        data: paginatedUsers,
        pagination: {
          page,
          limit,
          total: users.length,
          pages: Math.ceil(users.length / limit)
        }
      });
    } catch (error) {
      context.response.status(500).json({ message: 'Internal server error' });
    }
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new user',
    description: 'Creates a new user with the provided details'
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully'
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input'
  })
  @ApiSecurity([{ name: 'Bearer' }])
  @ValidateBody(UserSchema)
  async createUser(context: RequestContext) {
    try {
      const user = await this.userService.addUser(context.body);
      context.response.status(201).json({
        message: 'User created successfully',
        data: user
      });
    } catch (error) {
      context.response.status(500).json({ message: 'Internal server error' });
    }
  }

  @Get('/:id')
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Retrieves a specific user by their ID'
  })
  @ApiResponse({
    status: 200,
    description: 'User found'
  })
  @ApiResponse({
    status: 404,
    description: 'User not found'
  })
  @ValidateParams(UserParamsSchema)
  async getUserById(context: RequestContext) {
    try {
      const { id } = context.params;
      const user = await this.userService.getUserById(id);
      if (!user) {
        context.response.status(404).json({ message: 'User not found' });
        return;
      }
    return  context.response.json(user);
    } catch (error) {
     return context.response.status(500).json({ message: 'Internal server error' });
    }
  }

  @Put('/:id')
  @ApiOperation({
    summary: 'Update user',
    description: 'Updates a user with the provided details'
  })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully'
  })
  @ApiResponse({
    status: 404,
    description: 'User not found'
  })
  @ValidateParams(UserParamsSchema)
  @ValidateBody(UserUpdateSchema)
  async updateUser(context: RequestContext) {
    try {
      const { id } = context.params;
      const user = await this.userService.updateUser(id, context.body);
      if (!user) {
        context.response.status(404).json({ message: 'User not found' });
        return;
      }
      context.response.json({
        message: 'User updated successfully',
        data: user
      });
    } catch (error) {
      context.response.status(500).json({ message: 'Internal server error' });
    }
  }

  @Delete('/:id')
  @ApiOperation({
    summary: 'Delete user',
    description: 'Deletes a user by their ID'
  })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully'
  })
  @ApiResponse({
    status: 404,
    description: 'User not found'
  })
  @ValidateParams(UserParamsSchema)
  async deleteUser(context: RequestContext) {
    try {
      const { id } = context.params;
      const deleted = await this.userService.deleteUser(id);
      if (!deleted) {
        context.response.status(404).json({ message: 'User not found' });
        return;
      }
      context.response.json({ message: 'User deleted successfully' });
    } catch (error) {
      context.response.status(500).json({ message: 'Internal server error' });
    }
  }
} 