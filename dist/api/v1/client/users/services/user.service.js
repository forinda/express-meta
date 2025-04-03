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
exports.UserService = void 0;
const inversify_1 = require("inversify");
const user_repository_1 = require("../repositories/user.repository");
const base_service_1 = require("../../shared/services/base.service");
const auto_register_decorator_1 = require("../../../../decorators/auto-register.decorator");
let UserService = class UserService extends base_service_1.BaseService {
    constructor(userRepository) {
        super();
        this.userRepository = userRepository;
    }
    async getUsers() {
        return await this.withTransaction(async () => {
            return await this.userRepository.findAll();
        });
    }
    async getUserById(id) {
        return await this.withTransaction(async () => {
            return await this.userRepository.findById(id);
        });
    }
    async createUser(data) {
        return await this.withTransaction(async () => {
            return await this.userRepository.create(data);
        });
    }
    async updateUser(id, data) {
        return await this.withTransaction(async () => {
            return await this.userRepository.update(id, data);
        });
    }
    async deleteUser(id) {
        return await this.withTransaction(async () => {
            return await this.userRepository.delete(id);
        });
    }
    async createUserWithProfile(data, profileData) {
        return await this.withTransaction(async () => {
            return await this.userRepository.createWithProfile(data, profileData);
        });
    }
    async findAll(query) {
        return await this.withTransaction(async () => {
            return await this.userRepository.findAll();
        });
    }
    async findById(id) {
        return await this.withTransaction(async () => {
            const user = await this.userRepository.findById(id);
            return user || null;
        });
    }
    async create(data) {
        return await this.withTransaction(async () => {
            return await this.userRepository.create(data);
        });
    }
    async update(id, data) {
        return await this.withTransaction(async () => {
            const user = await this.userRepository.update(id, data);
            return user || null;
        });
    }
    async delete(id) {
        return await this.withTransaction(async () => {
            return await this.userRepository.delete(id);
        });
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, auto_register_decorator_1.AutoRegister)({ autoBind: true }),
    __param(0, (0, inversify_1.inject)(user_repository_1.UserRepository)),
    __metadata("design:paramtypes", [user_repository_1.UserRepository])
], UserService);
