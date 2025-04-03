"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppSetup = void 0;
const container_1 = require("../container");
const config_service_1 = require("../api/v1/client/shared/services/config.service");
const logger_service_1 = require("../api/v1/client/shared/services/logger.service");
const domain_registry_1 = require("../api/v1/client/shared/domain/domain.registry");
const plugins_setup_1 = require("./plugins.setup");
const error_setup_1 = require("./error.setup");
const swagger_setup_1 = require("../docs/swagger.setup");
const swagger_middleware_1 = require("../middleware/swagger.middleware");
const v1_1 = require("../api/v1");
/**
 * Application setup service
 */
class AppSetup {
    constructor(app) {
        this.app = app;
        this.configService = container_1.container.get(config_service_1.ConfigService);
        this.logger = container_1.container.get(logger_service_1.LoggerService);
        this.domainRegistry = container_1.container.get(domain_registry_1.ControllerDomainRegistry);
    }
    /**
     * Initialize the application
     */
    async initialize() {
        this.logger.info('Initializing application...');
        // Setup plugins and middleware
        (0, plugins_setup_1.setupPlugins)(this.app, this.configService);
        this.logger.info('Plugins setup complete');
        // Setup Swagger documentation
        (0, swagger_setup_1.setupSwagger)(this.app, this.configService, this.logger, this.domainRegistry);
        this.logger.info('Swagger setup complete');
        // Add Swagger middleware to serve JSON
        this.app.use(swagger_middleware_1.swaggerMiddleware);
        // Setup routes
        (0, v1_1.setupRoutes)(this.app);
        this.logger.info('Routes setup complete');
        // Setup error handling
        (0, error_setup_1.setupErrorHandling)(this.app, this.logger);
        this.logger.info('Application initialized successfully');
    }
    /**
     * Start the application
     */
    async start() {
        const serverConfig = this.configService.getServerConfig();
        const port = serverConfig.port;
        const host = serverConfig.host;
        // Log all mounted routes before starting the server
        this.logger.info('Server routes:');
        this.app._router.stack.forEach((middleware) => {
            if (middleware.route) {
                // Routes registered directly on the app
                this.logger.info(`${Object.keys(middleware.route.methods)} ${middleware.route.path}`);
            }
            else if (middleware.name === 'router') {
                // Router middleware
                middleware.handle.stack.forEach((handler) => {
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
exports.AppSetup = AppSetup;
