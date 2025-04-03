"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseFormatter = void 0;
const index_1 = require("../index");
class ResponseFormatter {
    /**
     * Format a successful response
     */
    static success(res, data, meta, statusCode = index_1.HttpStatus.OK) {
        const response = {
            success: true,
            data,
            meta
        };
        return res.status(statusCode).json(response);
    }
    /**
     * Format an error response
     */
    static error(res, error, statusCode = index_1.HttpStatus.INTERNAL_SERVER_ERROR) {
        const isApiError = error instanceof index_1.ApiError;
        const response = {
            success: false,
            error: {
                message: error.message,
                code: isApiError ? error.statusCode : statusCode,
                details: isApiError ? error.metadata : undefined
            }
        };
        return res.status(isApiError ? error.statusCode : statusCode).json(response);
    }
    /**
     * Format a paginated response
     */
    static paginated(res, data, page, limit, total, meta) {
        const totalPages = Math.ceil(total / limit);
        const response = {
            success: true,
            data,
            meta: {
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                },
                ...meta
            }
        };
        return res.status(index_1.HttpStatus.OK).json(response);
    }
}
exports.ResponseFormatter = ResponseFormatter;
