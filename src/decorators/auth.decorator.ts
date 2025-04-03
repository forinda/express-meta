import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { LoggerService } from '../api/v1/client/shared/services/logger.service';

export interface AuthOptions {
  required: boolean;
  cookieName?: string;
  redirectTo?: string;
}

export function Auth(options: AuthOptions = { required: true }) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
      const logger = container.resolve(LoggerService);
      const cookieName = options.cookieName || 'session';
      
      // Check if the session cookie exists
      const sessionCookie = req.cookies[cookieName];
      
      if (!sessionCookie && options.required) {
        logger.warn(`Authentication failed: No ${cookieName} cookie found`, {
          path: req.path,
          method: req.method,
          ip: req.ip
        });
        
        if (options.redirectTo) {
          return res.redirect(options.redirectTo);
        }
        
        return res.status(401).json({
          message: 'Authentication required',
          error: 'Unauthorized'
        });
      }
      
      // Add the session to the request object for use in the controller
      req.session = sessionCookie;
      
      // Call the original method
      return originalMethod.apply(this, [req, res, next]);
    };
    
    return descriptor;
  };
}

// Extend Express Request interface to include session
declare global {
  namespace Express {
    interface Request {
      session?: any;
    }
  }
} 