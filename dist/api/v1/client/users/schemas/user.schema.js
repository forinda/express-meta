"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paramsSchema = exports.querySchema = exports.updateUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
exports.createUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    email: zod_1.z.string().email(),
    age: zod_1.z.number().optional(),
});
exports.updateUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    email: zod_1.z.string().email().optional(),
    age: zod_1.z.number().optional(),
});
exports.querySchema = zod_1.z.object({
    page: zod_1.z.string().optional(),
    limit: zod_1.z.string().optional(),
});
exports.paramsSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
});
