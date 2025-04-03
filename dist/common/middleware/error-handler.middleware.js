"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const index_1 = require("../index");
/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
    // Log the error for debugging
    console.error('Error:', err);
    // Handle API errors
    if (err instanceof index_1.ApiError) {
        index_1.ResponseFormatter.error(res, err);
        return;
    }
    // Handle validation errors (e.g., from Zod)
    if (err.name === 'ZodError') {
        const zodError = err;
        const formattedError = new index_1.ApiError('Validation error', index_1.HttpStatus.BAD_REQUEST, { validationErrors: zodError.errors });
        index_1.ResponseFormatter.error(res, formattedError);
        return;
    }
    // Handle unknown errors
    const unknownError = new index_1.ApiError('Internal server error', index_1.HttpStatus.INTERNAL_SERVER_ERROR, { originalError: err.message });
    index_1.ResponseFormatter.error(res, unknownError);
};
exports.errorHandler = errorHandler;
