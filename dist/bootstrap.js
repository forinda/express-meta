"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./container");
const app_module_1 = require("./app/app.module");
const server_module_1 = require("./server/server.module");
const tsyringe_1 = require("tsyringe");
const logger_service_1 = require("./api/v1/client/shared/services/logger.service");
/**
 * Bootstrap the application
 */
async function bootstrap() {
    try {
        // Create app module
        const appModule = new app_module_1.AppModule();
        await appModule.initialize();
        // Create server module
        const serverModule = new server_module_1.ServerModule(appModule.getApp());
        await serverModule.start();
        // Handle process termination
        process.on('SIGTERM', async () => {
            const logger = tsyringe_1.container.resolve(logger_service_1.LoggerService);
            logger.info('SIGTERM received. Shutting down gracefully...');
            await serverModule.stop();
            process.exit(0);
        });
        process.on('SIGINT', async () => {
            const logger = tsyringe_1.container.resolve(logger_service_1.LoggerService);
            logger.info('SIGINT received. Shutting down gracefully...');
            await serverModule.stop();
            process.exit(0);
        });
    }
    catch (error) {
        console.error('Failed to start application:', error);
        process.exit(1);
    }
}
// Start the application
bootstrap();
