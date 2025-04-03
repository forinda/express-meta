"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const zod_1 = require("zod");
const validateRequest = (schema, source = 'body') => {
    return (req, res, next) => {
        try {
            const data = req[source];
            schema.parse(data);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                res.status(400).json({
                    error: 'Validation error',
                    details: error.errors
                });
            }
            else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    };
};
exports.validateRequest = validateRequest;
