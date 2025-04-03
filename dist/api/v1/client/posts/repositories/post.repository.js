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
exports.PostRepository = void 0;
const base_repository_1 = require("../../shared/repositories/base.repository");
const auto_register_decorator_1 = require("../../../../decorators/auto-register.decorator");
// Helper function to convert database nulls to undefined
const mapDbPostToPost = (dbPost) => ({
    ...dbPost
});
let PostRepository = class PostRepository extends base_repository_1.BaseRepository {
    constructor() {
        super('posts');
        this.posts = [];
    }
    async findAll() {
        return this.posts;
    }
    async findById(id) {
        return this.posts.find(post => post.id === id);
    }
    async create(data) {
        const newPost = {
            id: this.generateId(),
            ...data,
            created_at: new Date(),
            updated_at: new Date()
        };
        this.posts.push(newPost);
        return newPost;
    }
    async update(id, data) {
        const index = this.posts.findIndex(post => post.id === id);
        if (index === -1) {
            return undefined;
        }
        const updatedPost = {
            ...this.posts[index],
            ...data,
            updated_at: new Date()
        };
        this.posts[index] = updatedPost;
        return updatedPost;
    }
    async delete(id) {
        const index = this.posts.findIndex(post => post.id === id);
        if (index === -1) {
            return false;
        }
        this.posts.splice(index, 1);
        return true;
    }
    async findByAuthorId(authorId) {
        return this.posts.filter(post => post.author_id === authorId);
    }
    generateId() {
        return Math.random().toString(36).substring(2, 15);
    }
};
exports.PostRepository = PostRepository;
exports.PostRepository = PostRepository = __decorate([
    (0, auto_register_decorator_1.AutoRegister)({ autoBind: true }),
    __metadata("design:paramtypes", [])
], PostRepository);
