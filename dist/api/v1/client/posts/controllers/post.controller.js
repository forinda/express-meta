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
exports.PostController = void 0;
const express_1 = require("express");
const inversify_1 = require("inversify");
const post_service_1 = require("../services/post.service");
const swagger_decorator_1 = require("../../../shared/decorators/swagger.decorator");
const validation_decorator_1 = require("../../../shared/decorators/validation.decorator");
const post_schema_1 = require("../schemas/post.schema");
const response_utils_1 = require("../../../shared/utils/response.utils");
const auto_register_decorator_1 = require("../../../../decorators/auto-register.decorator");
let PostController = class PostController {
    constructor(postService) {
        this.postService = postService;
        this.router = (0, express_1.Router)();
        this.path = '/posts';
        this.setupRoutes();
    }
    setupRoutes() {
        this.router.get('/', this.getPosts.bind(this));
        this.router.post('/', this.createPost.bind(this));
        this.router.get('/:id', this.getPostById.bind(this));
        this.router.put('/:id', this.updatePost.bind(this));
        this.router.delete('/:id', this.deletePost.bind(this));
    }
    async getPosts(req, res) {
        try {
            const posts = await this.postService.findAll(req.query);
            res.json((0, response_utils_1.formatResponse)(posts));
        }
        catch (error) {
            res.status(500).json((0, response_utils_1.formatError)(error));
        }
    }
    async createPost(req, res) {
        try {
            const post = await this.postService.create(req.body);
            res.status(201).json((0, response_utils_1.formatResponse)(post));
        }
        catch (error) {
            res.status(400).json((0, response_utils_1.formatError)(error));
        }
    }
    async getPostById(req, res) {
        try {
            const post = await this.postService.findById(req.params.id);
            if (!post) {
                res.status(404).json((0, response_utils_1.formatError)({ message: 'Post not found' }));
                return;
            }
            res.json((0, response_utils_1.formatResponse)(post));
        }
        catch (error) {
            res.status(500).json((0, response_utils_1.formatError)(error));
        }
    }
    async updatePost(req, res) {
        try {
            const post = await this.postService.update(req.params.id, req.body);
            if (!post) {
                res.status(404).json((0, response_utils_1.formatError)({ message: 'Post not found' }));
                return;
            }
            res.json((0, response_utils_1.formatResponse)(post));
        }
        catch (error) {
            res.status(500).json((0, response_utils_1.formatError)(error));
        }
    }
    async deletePost(req, res) {
        try {
            const success = await this.postService.delete(req.params.id);
            if (!success) {
                res.status(404).json((0, response_utils_1.formatError)({ message: 'Post not found' }));
                return;
            }
            res.json((0, response_utils_1.formatResponse)({ message: 'Post deleted successfully' }));
        }
        catch (error) {
            res.status(500).json((0, response_utils_1.formatError)(error));
        }
    }
};
exports.PostController = PostController;
__decorate([
    (0, swagger_decorator_1.ApiOperation)({
        summary: 'Get all posts',
        description: 'Retrieve a list of all posts with optional pagination and filtering'
    }),
    (0, swagger_decorator_1.ApiResponse)(200, 'Successfully retrieved posts'),
    (0, validation_decorator_1.validateQuery)(post_schema_1.querySchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "getPosts", null);
__decorate([
    (0, swagger_decorator_1.ApiOperation)({
        summary: 'Create a new post',
        description: 'Create a new post with the provided data'
    }),
    (0, swagger_decorator_1.ApiResponse)(201, 'Post created successfully'),
    (0, swagger_decorator_1.ApiResponse)(400, 'Invalid input data'),
    (0, validation_decorator_1.validate)(post_schema_1.createPostSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "createPost", null);
__decorate([
    (0, swagger_decorator_1.ApiOperation)({
        summary: 'Get post by ID',
        description: 'Retrieve a specific post by its ID'
    }),
    (0, swagger_decorator_1.ApiResponse)(200, 'Successfully retrieved post'),
    (0, swagger_decorator_1.ApiResponse)(404, 'Post not found'),
    (0, validation_decorator_1.validateParams)(post_schema_1.paramsSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "getPostById", null);
__decorate([
    (0, swagger_decorator_1.ApiOperation)({
        summary: 'Update post',
        description: 'Update an existing post with the provided data'
    }),
    (0, swagger_decorator_1.ApiResponse)(200, 'Post updated successfully'),
    (0, swagger_decorator_1.ApiResponse)(404, 'Post not found'),
    (0, validation_decorator_1.validateParams)(post_schema_1.paramsSchema),
    (0, validation_decorator_1.validate)(post_schema_1.updatePostSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "updatePost", null);
__decorate([
    (0, swagger_decorator_1.ApiOperation)({
        summary: 'Delete post',
        description: 'Delete an existing post by its ID'
    }),
    (0, swagger_decorator_1.ApiResponse)(200, 'Post deleted successfully'),
    (0, swagger_decorator_1.ApiResponse)(404, 'Post not found'),
    (0, validation_decorator_1.validateParams)(post_schema_1.paramsSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "deletePost", null);
exports.PostController = PostController = __decorate([
    (0, auto_register_decorator_1.AutoRegister)({ autoBind: true }),
    (0, swagger_decorator_1.ApiTags)('Posts'),
    __param(0, (0, inversify_1.inject)(post_service_1.PostService)),
    __metadata("design:paramtypes", [post_service_1.PostService])
], PostController);
