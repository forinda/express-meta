"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatResponse = formatResponse;
exports.formatError = formatError;
exports.formatPaginatedResponse = formatPaginatedResponse;
const api_error_1 = require("../errors/api-error");
function formatResponse(res, data, message, status = api_error_1.HttpStatus.OK) {
    const response = {
        success: true,
        data,
        message
    };
    return res.status(status).json(response);
}
function formatError(res, error, status = api_error_1.HttpStatus.INTERNAL_SERVER_ERROR) {
    const apiError = error instanceof api_error_1.ApiError ? error : new api_error_1.ApiError(error.message, status, { originalError: error.message });
    const response = {
        success: false,
        error: {
            message: apiError.message,
            code: apiError.statusCode,
            details: apiError.metadata
        }
    };
    return res.status(apiError.statusCode).json(response);
}
function formatPaginatedResponse(res, data, page, limit, total, message) {
    const pages = Math.ceil(total / limit);
    const response = {
        success: true,
        data: {
            data,
            pagination: {
                page,
                limit,
                total,
                pages
            }
        },
        message
    };
    return res.status(api_error_1.HttpStatus.OK).json(response);
}
