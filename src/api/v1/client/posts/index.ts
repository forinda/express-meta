import { Router } from 'express';
import { container } from '../../../../container';
import { PostController } from './controllers/post.controller';
import { ApiError } from '../shared/errors/api.error';

/**
 * Setup post routes
 * @returns Express router with post routes
 */
export function setupPostRoutes(): Router {
  // Resolve the PostController from the container
  const postController = container.get(PostController);
  
  // Check if the router is initialized
  if (!postController.router) {
    throw new ApiError(500, 'Post controller router not initialized');
  }
  
  return postController.router;
}

// For backward compatibility
export default setupPostRoutes; 