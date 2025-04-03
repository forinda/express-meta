import { Request, Response, NextFunction } from 'express';
import { ApiError, ResponseFormatter, HttpStatus } from '../index';
import { IRequest, IResponse } from '../interfaces/express.interface';

/**
 * Global error handling middleware
 */
export const errorHandler = (
  err: Error,
  req: IRequest,
  res: IResponse,
  next: NextFunction
): void => {
  // Log the error for debugging
  console.error('Error:', err);

  // Handle API errors
  if (err instanceof ApiError) {
    ResponseFormatter.error(res, err);
    return;
  }

  // Handle validation errors (e.g., from Zod)
  if (err.name === 'ZodError') {
    const zodError = err as any;
    const formattedError = new ApiError(
      'Validation error',
      HttpStatus.BAD_REQUEST,
      { validationErrors: zodError.errors }
    );
    ResponseFormatter.error(res, formattedError);
    return;
  }

  // Handle unknown errors
  const unknownError = new ApiError(
    'Internal server error',
    HttpStatus.INTERNAL_SERVER_ERROR,
    { originalError: err.message }
  );
  ResponseFormatter.error(res, unknownError);
}; 