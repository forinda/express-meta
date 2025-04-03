import { Application } from 'express';
import { container } from '../container';
import { ConfigService } from '../api/v1/client/shared/services/config.service';
import { LoggerService } from '../api/v1/client/shared/services/logger.service';
import { ControllerDomainRegistry } from '../api/v1/client/shared/domain/domain.registry';
import { setupPlugins } from './plugins.setup';
import { setupErrorHandling } from './error.setup';
import { setupSwagger } from '../docs/swagger.setup';
import { swaggerMiddleware } from '../middleware/swagger.middleware';
import { setupRoutes } from '../api/v1';

/**
 * Application setup service
 */
export class AppSetup {
  private app: Application;
  private configService: ConfigService;
  private logger: LoggerService;
  private domainRegistry: ControllerDomainRegistry;

  constructor(app: Application) {
    this.app = app;
    this.configService = container.get(ConfigService);
    this.logger = container.get(LoggerService);
    this.domainRegistry = container.get(ControllerDomainRegistry);
  }

  /**
   * Initialize the application
   */
  async initialize(): Promise<void> {
    this.logger.info('Initializing application...');

    // Setup plugins and middleware
    setupPlugins(this.app, this.configService);
    this.logger.info('Plugins setup complete');
    
    // Setup Swagger documentation
    setupSwagger(this.app, this.configService, this.logger, this.domainRegistry);
    this.logger.info('Swagger setup complete');
    
    // Add Swagger middleware to serve JSON
    this.app.use(swaggerMiddleware);

    // Setup routes
    setupRoutes(this.app);
    this.logger.info('Routes setup complete');

    // Setup error handling
    setupErrorHandling(this.app, this.logger);

    this.logger.info('Application initialized successfully');
  }

  /**
   * Start the application
   */
  async start(): Promise<void> {
    const serverConfig = this.configService.getServerConfig();
    const port = serverConfig.port;
    const host = serverConfig.host;

    // Log all mounted routes before starting the server
    this.logger.info('Server routes:');
    this.app._router.stack.forEach((middleware: any) => {
      if (middleware.route) {
        // Routes registered directly on the app
        this.logger.info(`${Object.keys(middleware.route.methods)} ${middleware.route.path}`);
      } else if (middleware.name === 'router') {
        // Router middleware
        middleware.handle.stack.forEach((handler: any) => {
          if (handler.route) {
            const path = handler.route.path;
            const methods = Object.keys(handler.route.methods)
              .filter(method => handler.route.methods[method])
              .map(method => method.toUpperCase());
            this.logger.info(`${methods.join(',')} ${middleware.regexp}${path}`);
          }
        });
      }
    });

    this.app.listen(port, host, () => {
      this.logger.info(`Server is running on http://${host}:${port}`);
      this.logger.info(`Swagger documentation available at http://${host}:${port}/api-docs`);
    });
  }
} 