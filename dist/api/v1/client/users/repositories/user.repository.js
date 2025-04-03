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
exports.UserRepository = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../../shared/db/schema");
const base_repository_1 = require("../../shared/repositories/base.repository");
const auto_register_decorator_1 = require("../../../../decorators/auto-register.decorator");
// Helper function to convert database nulls to undefined
const mapDbUserToUser = (dbUser) => ({
    ...dbUser,
    age: dbUser.age === null ? undefined : dbUser.age
});
let UserRepository = class UserRepository extends base_repository_1.BaseRepository {
    constructor() {
        super('users');
    }
    async findAll() {
        return await this.withTransaction(async (tx) => {
            const dbUsers = await tx.select().from(schema_1.users);
            return dbUsers.map(mapDbUserToUser);
        });
    }
    async findById(id) {
        return await this.withTransaction(async (tx) => {
            const [dbUser] = await tx.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, id));
            return dbUser ? mapDbUserToUser(dbUser) : undefined;
        });
    }
    async create(data) {
        return await this.withTransaction(async (tx) => {
            const [dbUser] = await tx.insert(schema_1.users).values(data).returning();
            return mapDbUserToUser(dbUser);
        });
    }
    async update(id, data) {
        return await this.withTransaction(async (tx) => {
            const [dbUser] = await tx
                .update(schema_1.users)
                .set({ ...data, updated_at: new Date() })
                .where((0, drizzle_orm_1.eq)(schema_1.users.id, id))
                .returning();
            return dbUser ? mapDbUserToUser(dbUser) : undefined;
        });
    }
    async delete(id) {
        return await this.withTransaction(async (tx) => {
            const [user] = await tx.delete(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, id)).returning();
            return !!user;
        });
    }
    async createWithProfile(data, profileData) {
        return await this.withTransaction(async (tx) => {
            // Example of a complex transaction
            const [dbUser] = await tx.insert(schema_1.users).values(data).returning();
            // Here you would insert profile data in another table
            // const [profile] = await tx.insert(profiles).values({
            //   userId: user.id,
            //   ...profileData
            // }).returning();
            return mapDbUserToUser(dbUser);
        });
    }
};
exports.UserRepository = UserRepository;
exports.UserRepository = UserRepository = __decorate([
    (0, auto_register_decorator_1.AutoRegister)({ autoBind: true }),
    __metadata("design:paramtypes", [])
], UserRepository);
