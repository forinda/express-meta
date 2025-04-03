import { RequestContext } from '@/context/request.context';
import { PaginationOptions } from '../middleware/pagination.middleware';
import { ApiError, HttpStatus } from '../index';

/**
 * Decorator to extract pagination options from the request context
 * and inject them into the method parameters
 */
export function Pagination() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      // Find the RequestContext parameter
      const contextIndex = args.findIndex(arg => 
        arg && typeof arg === 'object' && 'request' in arg && 'response' in arg
      );
      
      if (contextIndex === -1) {
        throw new Error('RequestContext not found in method parameters');
      }

      const context = args[contextIndex] as RequestContext;
      
      // Default pagination values
      const defaultPage = 1;
      const defaultLimit = 10;
      const maxLimit = 100;

      // Extract pagination parameters from query
      const pageParam = context.query.page as string | undefined;
      const limitParam = context.query.limit as string | undefined;

      // Parse and validate page
      let page = defaultPage;
      if (pageParam) {
        const parsedPage = parseInt(pageParam, 10);
        if (isNaN(parsedPage) || parsedPage < 1) {
          throw new ApiError('Invalid page parameter', HttpStatus.BAD_REQUEST);
        }
        page = parsedPage;
      }

      // Parse and validate limit
      let limit = defaultLimit;
      if (limitParam) {
        const parsedLimit = parseInt(limitParam, 10);
        if (isNaN(parsedLimit) || parsedLimit < 1) {
          throw new ApiError('Invalid limit parameter', HttpStatus.BAD_REQUEST);
        }
        if (parsedLimit > maxLimit) {
          throw new ApiError(`Limit cannot exceed ${maxLimit}`, HttpStatus.BAD_REQUEST);
        }
        limit = parsedLimit;
      }

      // Calculate skip value for database queries
      const skip = (page - 1) * limit;

      // Create pagination options
      const pagination: PaginationOptions = { page, limit, skip };

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