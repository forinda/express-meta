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
exports.PostService = void 0;
const inversify_1 = require("inversify");
const post_repository_1 = require("../repositories/post.repository");
const base_service_1 = require("../../shared/services/base.service");
const auto_register_decorator_1 = require("../../../../decorators/auto-register.decorator");
let PostService = class PostService extends base_service_1.BaseService {
    constructor(postRepository) {
        super();
        this.postRepository = postRepository;
    }
    async getPosts() {
        return await this.withTransaction(async () => {
            return await this.postRepository.findAll();
        });
    }
    async getPostById(id) {
        return await this.withTransaction(async () => {
            return await this.postRepository.findById(id);
        });
    }
    async createPost(data) {
        return await this.withTransaction(async () => {
            return await this.postRepository.create(data);
        });
    }
    async updatePost(id, data) {
        return await this.withTransaction(async () => {
            return await this.postRepository.update(id, data);
        });
    }
    async deletePost(id) {
        return await this.withTransaction(async () => {
            return await this.postRepository.delete(id);
        });
    }
    // New methods for the controller
    async findAll(query) {
        return await this.withTransaction(async () => {
            return await this.postRepository.findAll();
        });
    }
    async findById(id) {
        return await this.withTransaction(async () => {
            const post = await this.postRepository.findById(id);
            return post || null;
        });
    }
    async create(data) {
        return await this.withTransaction(async () => {
            return await this.postRepository.create(data);
        });
    }
    async update(id, data) {
        return await this.withTransaction(async () => {
            const post = await this.postRepository.update(id, data);
            return post || null;
        });
    }
    async delete(id) {
        return await this.withTransaction(async () => {
            return await this.postRepository.delete(id);
        });
    }
    async getPostsByAuthorId(authorId) {
        return await this.withTransaction(async () => {
            return await this.postRepository.findByAuthorId(authorId);
        });
    }
};
exports.PostService = PostService;
exports.PostService = PostService = __decorate([
    (0, auto_register_decorator_1.AutoRegister)({ autoBind: true }),
    __param(0, (0, inversify_1.inject)(post_repository_1.PostRepository)),
    __metadata("design:paramtypes", [post_repository_1.PostRepository])
], PostService);
