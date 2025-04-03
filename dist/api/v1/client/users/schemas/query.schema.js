"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.querySchema = void 0;
const zod_1 = require("zod");
exports.querySchema = zod_1.z.object({
    page: zod_1.z.string().optional(),
    limit: zod_1.z.string().optional(),
});
