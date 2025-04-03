import { NextFunction } from 'express';
import { IRequest, IResponse } from '../interfaces/express.interface';
import { HttpStatus } from '../constants/http-status.codes';
import { ApiError } from '../errors/api-error';

export interface PaginationOptions {
  page: number;
  limit: number;
  skip: number;
}

declare global {
  namespace Express {
    interface Request {
      pagination: PaginationOptions;
    }
  }
}

/**
 * Middleware to extract pagination parameters from query
 * and inject them into the request object
 */
export const paginationMiddleware = (
  req: IRequest,
  res: IResponse,
  next: NextFunction
): void => {
  try {
    // Default values
    const defaultPage = 1;
    const defaultLimit = 10;
    const maxLimit = 100;

    // Extract pagination parameters from query
    const pageParam = req.query.page as string | undefined;
    const limitParam = req.query.limit as string | undefined;

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

    // Add pagination options to request
    req.pagination = { page, limit, skip };

    // Remove pagination parameters from query to avoid conflicts
    delete req.query.page;
    delete req.query.limit;

    next();
  } catch (error) {
    next(error);
  }
}; 