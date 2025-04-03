import './container';
import { AppModule } from '@/app/app.module';
import { ServerModule } from '@/server/server.module';
import { container } from 'tsyringe';
import { LoggerService } from '@/api/v1/client/shared/services/logger.service';

/**
 * Bootstrap the application
 */
async function bootstrap() {
  try {
    // Create app module
    const appModule = new AppModule();
    await appModule.initialize();

    // Create server module
    const serverModule = new ServerModule(appModule.getApp());
    await serverModule.start();

    // Handle process termination
    process.on('SIGTERM', async () => {
      const logger = container.resolve(LoggerService);
      logger.info('SIGTERM received. Shutting down gracefully...');
      await serverModule.stop();
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      const logger = container.resolve(LoggerService);
      logger.info('SIGINT received. Shutting down gracefully...');
      await serverModule.stop();
      process.exit(0);
    });
  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
}

// Start the application
bootstrap(); 