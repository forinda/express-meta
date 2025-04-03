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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const express_1 = require("express");
const inversify_1 = require("inversify");
const user_service_1 = require("../services/user.service");
const swagger_decorator_1 = require("../../../shared/decorators/swagger.decorator");
const validation_decorator_1 = require("../../../shared/decorators/validation.decorator");
const user_schema_1 = require("../schemas/user.schema");
const response_utils_1 = require("../../../shared/utils/response.utils");
const auto_register_decorator_1 = require("../../../../decorators/auto-register.decorator");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
        this.router = (0, express_1.Router)();
        this.path = '/users';
        this.setupRoutes();
    }
    setupRoutes() {
        this.router.get('/', this.getUsers.bind(this));
        this.router.post('/', this.createUser.bind(this));
        this.router.get('/:id', this.getUserById.bind(this));
        this.router.put('/:id', this.updateUser.bind(this));
        this.router.delete('/:id', this.deleteUser.bind(this));
    }
    async getUsers(req, res) {
        try {
            const users = await this.userService.findAll(req.query);
            res.json((0, response_utils_1.formatResponse)(users));
        }
        catch (error) {
            res.status(500).json((0, response_utils_1.formatError)(error));
        }
    }
    async createUser(req, res) {
        try {
            const user = await this.userService.create(req.body);
            res.status(201).json((0, response_utils_1.formatResponse)(user));
        }
        catch (error) {
            res.status(400).json((0, response_utils_1.formatError)(error));
        }
    }
    async getUserById(req, res) {
        try {
            const user = await this.userService.findById(req.params.id);
            if (!user) {
                res.status(404).json((0, response_utils_1.formatError)({ message: 'User not found' }));
                return;
            }
            res.json((0, response_utils_1.formatResponse)(user));
        }
        catch (error) {
            res.status(500).json((0, response_utils_1.formatError)(error));
        }
    }
    async updateUser(req, res) {
        try {
            const user = await this.userService.update(req.params.id, req.body);
            if (!user) {
                res.status(404).json((0, response_utils_1.formatError)({ message: 'User not found' }));
                return;
            }
            res.json((0, response_utils_1.formatResponse)(user));
        }
        catch (error) {
            res.status(500).json((0, response_utils_1.formatError)(error));
        }
    }
    async deleteUser(req, res) {
        try {
            const success = await this.userService.delete(req.params.id);
            if (!success) {
                res.status(404).json((0, response_utils_1.formatError)({ message: 'User not found' }));
                return;
            }
            res.json((0, response_utils_1.formatResponse)({ message: 'User deleted successfully' }));
        }
        catch (error) {
            res.status(500).json((0, response_utils_1.formatError)(error));
        }
    }
};
exports.UserController = UserController;
__decorate([
    (0, swagger_decorator_1.ApiOperation)({
        summary: 'Get all users',
        description: 'Retrieve a list of all users with optional pagination and filtering'
    }),
    (0, swagger_decorator_1.ApiResponse)(200, 'Successfully retrieved users'),
    (0, validation_decorator_1.validateQuery)(user_schema_1.querySchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUsers", null);
__decorate([
    (0, swagger_decorator_1.ApiOperation)({
        summary: 'Create a new user',
        description: 'Create a new user with the provided data'
    }),
    (0, swagger_decorator_1.ApiResponse)(201, 'User created successfully'),
    (0, swagger_decorator_1.ApiResponse)(400, 'Invalid input data'),
    (0, validation_decorator_1.validate)(user_schema_1.createUserSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createUser", null);
__decorate([
    (0, swagger_decorator_1.ApiOperation)({
        summary: 'Get user by ID',
        description: 'Retrieve a specific user by their ID'
    }),
    (0, swagger_decorator_1.ApiResponse)(200, 'Successfully retrieved user'),
    (0, swagger_decorator_1.ApiResponse)(404, 'User not found'),
    (0, validation_decorator_1.validateParams)(user_schema_1.paramsSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserById", null);
__decorate([
    (0, swagger_decorator_1.ApiOperation)({
        summary: 'Update user',
        description: 'Update an existing user with the provided data'
    }),
    (0, swagger_decorator_1.ApiResponse)(200, 'User updated successfully'),
    (0, swagger_decorator_1.ApiResponse)(404, 'User not found'),
    (0, validation_decorator_1.validateParams)(user_schema_1.paramsSchema),
    (0, validation_decorator_1.validate)(user_schema_1.updateUserSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUser", null);
__decorate([
    (0, swagger_decorator_1.ApiOperation)({
        summary: 'Delete user',
        description: 'Delete an existing user by their ID'
    }),
    (0, swagger_decorator_1.ApiResponse)(200, 'User deleted successfully'),
    (0, swagger_decorator_1.ApiResponse)(404, 'User not found'),
    (0, validation_decorator_1.validateParams)(user_schema_1.paramsSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteUser", null);
exports.UserController = UserController = __decorate([
    (0, auto_register_decorator_1.AutoRegister)({ autoBind: true }),
    (0, swagger_decorator_1.ApiTags)('Users'),
    __param(0, (0, inversify_1.inject)(user_service_1.UserService)),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
