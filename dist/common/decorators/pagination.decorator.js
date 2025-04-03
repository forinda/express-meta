"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pagination = Pagination;
const index_1 = require("../index");
/**
 * Decorator to extract pagination options from the request context
 * and inject them into the method parameters
 */
function Pagination() {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            // Find the RequestContext parameter
            const contextIndex = args.findIndex(arg => arg && typeof arg === 'object' && 'request' in arg && 'response' in arg);
            if (contextIndex === -1) {
                throw new Error('RequestContext not found in method parameters');
            }
            const context = args[contextIndex];
            // Default pagination values
            const defaultPage = 1;
            const defaultLimit = 10;
            const maxLimit = 100;
            // Extract pagination parameters from query
            const pageParam = context.query.page;
            const limitParam = context.query.limit;
            // Parse and validate page
            let page = defaultPage;
            if (pageParam) {
                const parsedPage = parseInt(pageParam, 10);
                if (isNaN(parsedPage) || parsedPage < 1) {
                    throw new index_1.ApiError('Invalid page parameter', index_1.HttpStatus.BAD_REQUEST);
                }
                page = parsedPage;
            }
            // Parse and validate limit
            let limit = defaultLimit;
            if (limitParam) {
                const parsedLimit = parseInt(limitParam, 10);
                if (isNaN(parsedLimit) || parsedLimit < 1) {
                    throw new index_1.ApiError('Invalid limit parameter', index_1.HttpStatus.BAD_REQUEST);
                }
                if (parsedLimit > maxLimit) {
                    throw new index_1.ApiError(`Limit cannot exceed ${maxLimit}`, index_1.HttpStatus.BAD_REQUEST);
                }
                limit = parsedLimit;
            }
            // Calculate skip value for database queries
            const skip = (page - 1) * limit;
            // Create pagination options
            const pagination = { page, limit, skip };
            // Remove pagination parameters from query to avoid conflicts
            delete context.query.page;
            delete context.query.limit;
            // Add pagination to context
            context.pagination = pagination;
            // Call the original method
            return originalMethod.apply(this, args);
        };
        return descriptor;
    };
}
