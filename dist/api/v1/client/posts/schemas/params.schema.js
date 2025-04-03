"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paramsSchema = void 0;
const zod_1 = require("zod");
exports.paramsSchema = zod_1.z.object({
    id: zod_1.z.string().min(1, 'Post ID is required'),
});
