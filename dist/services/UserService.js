"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const tsyringe_1 = require("tsyringe");
const config_1 = require("../db/config");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
let UserService = class UserService {
    async getUsers() {
        return await config_1.db.select().from(schema_1.users);
    }
    async addUser(user) {
        const [newUser] = await config_1.db.insert(schema_1.users).values(user).returning();
        return newUser;
    }
    async getUserById(id) {
        const [user] = await config_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, id));
        return user;
    }
    async updateUser(id, data) {
        const [updatedUser] = await config_1.db
            .update(schema_1.users)
            .set({ ...data, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_1.users.id, id))
            .returning();
        return updatedUser;
    }
    async deleteUser(id) {
        const [deletedUser] = await config_1.db.delete(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, id)).returning();
        return !!deletedUser;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, tsyringe_1.injectable)()
], UserService);
