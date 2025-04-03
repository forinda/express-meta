"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const api_error_1 = require("../common/errors/api-error");
const errorHandler = (err, req, res, next) => {
    if (err instanceof api_error_1.ApiError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
            ...(err.details && { details: err.details })
        });
        return;
    }
    // Log unexpected errors
    console.error('Unexpected error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { error: err.message })
    });
};
exports.errorHandler = errorHandler;
