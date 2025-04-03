import 'reflect-metadata';
import express, { Application } from 'express';
import { container } from 'tsyringe';
import { ConfigService } from './api/v1/client/shared/services/config.service';
import { LoggerService } from './api/v1/client/shared/services/logger.service';
import { ControllerDomainRegistry } from './api/v1/client/shared/domain/domain.registry';
import { AppSetup } from './setup/app.setup';

export class App {
  private app: Application;
  private configService: ConfigService;
  private logger: LoggerService;
  private domainRegistry: ControllerDomainRegistry;
  private appSetup: AppSetup;

  constructor() {
    this.app = express();
    this.configService = container.resolve(ConfigService);
    this.logger = container.resolve(LoggerService);
    this.domainRegistry = container.resolve(ControllerDomainRegistry);
    this.appSetup = new AppSetup(this.app);
  }

  public async start(): Promise<void> {
    try {
      // Initialize application using AppSetup
      await this.appSetup.initialize();
      
      // Start the server
      await this.appSetup.start();
    } catch (error) {
      this.logger.error('Failed to start server:', { error });
      process.exit(1);
    }
  }
}

// Create and start the application
const app = new App();
app.start().catch(console.error);

export default app; 