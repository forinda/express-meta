"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePostSchema = void 0;
const zod_1 = require("zod");
exports.updatePostSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required').optional(),
    content: zod_1.z.string().min(1, 'Content is required').optional(),
    published: zod_1.z.boolean().optional(),
});
