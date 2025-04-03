"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.querySchema = void 0;
const zod_1 = require("zod");
exports.querySchema = zod_1.z.object({
    author_id: zod_1.z.string().optional(),
    published: zod_1.z.boolean().optional(),
});
