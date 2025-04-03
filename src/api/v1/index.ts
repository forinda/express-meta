import { Router } from 'express';
import { setupUserRoutes } from './client/users';
import { setupPostRoutes } from './client/posts';

/**
 * Setup all API routes
 * @param app Express application
 */
export function setupRoutes(app: any): void {
  const router = Router();
  
  // Mount API routes
  router.use('/users', setupUserRoutes());
  router.use('/posts', setupPostRoutes());
  
  // Mount the API router
  app.use('/api/v1', router);
}