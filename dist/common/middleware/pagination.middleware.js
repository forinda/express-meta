"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationMiddleware = void 0;
const http_status_codes_1 = require("../constants/http-status.codes");
const api_error_1 = require("../errors/api-error");
/**
 * Middleware to extract pagination parameters from query
 * and inject them into the request object
 */
const paginationMiddleware = (req, res, next) => {
    try {
        // Default values
        const defaultPage = 1;
        const defaultLimit = 10;
        const maxLimit = 100;
        // Extract pagination parameters from query
        const pageParam = req.query.page;
        const limitParam = req.query.limit;
        // Parse and validate page
        let page = defaultPage;
        if (pageParam) {
            const parsedPage = parseInt(pageParam, 10);
            if (isNaN(parsedPage) || parsedPage < 1) {
                throw new api_error_1.ApiError('Invalid page parameter', http_status_codes_1.HttpStatus.BAD_REQUEST);
            }
            page = parsedPage;
        }
        // Parse and validate limit
        let limit = defaultLimit;
        if (limitParam) {
            const parsedLimit = parseInt(limitParam, 10);
            if (isNaN(parsedLimit) || parsedLimit < 1) {
                throw new api_error_1.ApiError('Invalid limit parameter', http_status_codes_1.HttpStatus.BAD_REQUEST);
            }
            if (parsedLimit > maxLimit) {
                throw new api_error_1.ApiError(`Limit cannot exceed ${maxLimit}`, http_status_codes_1.HttpStatus.BAD_REQUEST);
            }
            limit = parsedLimit;
        }
        // Calculate skip value for database queries
        const skip = (page - 1) * limit;
        // Add pagination options to request
        req.pagination = { page, limit, skip };
        // Remove pagination parameters from query to avoid conflicts
        delete req.query.page;
        delete req.query.limit;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.paginationMiddleware = paginationMiddleware;
