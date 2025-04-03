import { Response } from 'express';
import { ApiError, HttpStatus } from '../errors/api-error';
import { HttpStatusCode } from '../constants/http-status.codes';

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: number;
    details?: any;
  };
  message?: string;
}

export function formatResponse<T>(
  res: Response,
  data: T,
  message?: string,
  status: number = HttpStatus.OK
) {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message
  };
 return res.status(status).json(response);
}

export function formatError(
  res: Response,
  error: Error | ApiError,
  status: HttpStatusCode = HttpStatus.INTERNAL_SERVER_ERROR
) {
  const apiError = error instanceof ApiError ? error : new ApiError(
    error.message,
    status as unknown as HttpStatus,
    { originalError: error.message }
  );

  const response: ApiResponse<null> = {
    success: false,
    error: {
      message: apiError.message,
      code: apiError.statusCode,
      details: apiError.metadata
    }
  };
 return res.status(apiError.statusCode).json(response);
}

export function formatPaginatedResponse<T>(
  res: Response,
  data: T[],
  page: number,
  limit: number,
  total: number,
  message?: string
) {
  const pages = Math.ceil(total / limit);
  const response: ApiResponse<PaginatedResponse<T>> = {
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
  return res.status(HttpStatus.OK).json(response);
} 