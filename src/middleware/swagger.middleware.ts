import { Request, Response, NextFunction } from 'express';
import { getSwaggerDocument } from '@/decorators/swagger.decorator';

/**
 * Middleware to serve Swagger documentation
 * This middleware is used to serve the Swagger documentation in JSON format
 * The Swagger UI is served by the setupSwagger function in swagger.setup.ts
 */
export const swaggerMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  if (req.path === '/api-docs.json') {
    res.json(getSwaggerDocument());
  } else {
    next();
  }
}; 