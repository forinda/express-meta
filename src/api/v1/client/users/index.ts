import { Router } from 'express';
import { container } from '../../../../container';
import { UserController } from './controllers/user.controller';
import { ApiError } from '../shared/errors/api.error';

/**
 * Setup user routes
 * @returns Express router with user routes
 */
export function setupUserRoutes(): Router {
  // Resolve the UserController from the container
  const userController = container.get(UserController);
  
  // Check if the router is initialized
  if (!userController.router) {
    throw new ApiError(500, 'User controller router not initialized');
  }
  
  return userController.router;
}

// For backward compatibility
export default setupUserRoutes; 