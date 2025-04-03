"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const zod_1 = require("zod");
const UserService_1 = require("../services/UserService");
const controller_decorator_1 = require("../decorators/controller.decorator");
const validation_decorator_1 = require("../decorators/validation.decorator");
const swagger_decorator_1 = require("../decorators/swagger.decorator");
const UserSchema = zod_1.z.object({
    name: zod_1.z.string().min(3),
    email: zod_1.z.string().email(),
    age: zod_1.z.number().min(18)
});
const UserUpdateSchema = UserSchema.partial();
const UserQuerySchema = zod_1.z.object({
    page: zod_1.z.number().default(1),
    limit: zod_1.z.number().default(10)
});
const UserParamsSchema = zod_1.z.object({
    id: zod_1.z.string().uuid()
});
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async getUsers(context) {
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
        }
        catch (error) {
            context.response.status(500).json({ message: 'Internal server error' });
        }
    }
    async createUser(context) {
        try {
            const user = await this.userService.addUser(context.body);
            context.response.status(201).json({
                message: 'User created successfully',
                data: user
            });
        }
        catch (error) {
            context.response.status(500).json({ message: 'Internal server error' });
        }
    }
    async getUserById(context) {
        try {
            const { id } = context.params;
            const user = await this.userService.getUserById(id);
            if (!user) {
                context.response.status(404).json({ message: 'User not found' });
                return;
            }
            return context.response.json(user);
        }
        catch (error) {
            return context.response.status(500).json({ message: 'Internal server error' });
        }
    }
    async updateUser(context) {
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
        }
        catch (error) {
            context.response.status(500).json({ message: 'Internal server error' });
        }
    }
    async deleteUser(context) {
        try {
            const { id } = context.params;
            const deleted = await this.userService.deleteUser(id);
            if (!deleted) {
                context.response.status(404).json({ message: 'User not found' });
                return;
            }
            context.response.json({ message: 'User deleted successfully' });
        }
        catch (error) {
            context.response.status(500).json({ message: 'Internal server error' });
        }
    }
};
exports.UserController = UserController;
__decorate([
    (0, controller_decorator_1.Get)(),
    (0, swagger_decorator_1.ApiOperation)({
        summary: 'Get all users',
        description: 'Retrieves a list of all users with pagination',
        tags: ['users', 'users-list']
    }),
    (0, swagger_decorator_1.ApiResponse)({
        status: 200,
        description: 'List of users'
    }),
    (0, swagger_decorator_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized'
    }),
    (0, validation_decorator_1.validateQuery)(UserQuerySchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUsers", null);
__decorate([
    (0, controller_decorator_1.Post)(),
    (0, swagger_decorator_1.ApiOperation)({
        summary: 'Create a new user',
        description: 'Creates a new user with the provided details'
    }),
    (0, swagger_decorator_1.ApiResponse)({
        status: 201,
        description: 'User created successfully'
    }),
    (0, swagger_decorator_1.ApiResponse)({
        status: 400,
        description: 'Invalid input'
    }),
    (0, swagger_decorator_1.ApiSecurity)([{ name: 'Bearer' }]),
    (0, validation_decorator_1.validate)(UserSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createUser", null);
__decorate([
    (0, controller_decorator_1.Get)('/:id'),
    (0, swagger_decorator_1.ApiOperation)({
        summary: 'Get user by ID',
        description: 'Retrieves a specific user by their ID'
    }),
    (0, swagger_decorator_1.ApiResponse)({
        status: 200,
        description: 'User found'
    }),
    (0, swagger_decorator_1.ApiResponse)({
        status: 404,
        description: 'User not found'
    }),
    (0, validation_decorator_1.validateParams)(UserParamsSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserById", null);
__decorate([
    (0, controller_decorator_1.Put)('/:id'),
    (0, swagger_decorator_1.ApiOperation)({
        summary: 'Update user',
        description: 'Updates a user with the provided details'
    }),
    (0, swagger_decorator_1.ApiResponse)({
        status: 200,
        description: 'User updated successfully'
    }),
    (0, swagger_decorator_1.ApiResponse)({
        status: 404,
        description: 'User not found'
    }),
    (0, validation_decorator_1.validateParams)(UserParamsSchema),
    (0, validation_decorator_1.validate)(UserUpdateSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUser", null);
__decorate([
    (0, controller_decorator_1.Delete)('/:id'),
    (0, swagger_decorator_1.ApiOperation)({
        summary: 'Delete user',
        description: 'Deletes a user by their ID'
    }),
    (0, swagger_decorator_1.ApiResponse)({
        status: 200,
        description: 'User deleted successfully'
    }),
    (0, swagger_decorator_1.ApiResponse)({
        status: 404,
        description: 'User not found'
    }),
    (0, validation_decorator_1.validateParams)(UserParamsSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteUser", null);
exports.UserController = UserController = __decorate([
    (0, controller_decorator_1.Controller)('/users'),
    (0, swagger_decorator_1.ApiTags)('Users'),
    __metadata("design:paramtypes", [UserService_1.UserService])
], UserController);
