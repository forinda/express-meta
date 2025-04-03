"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const tsyringe_1 = require("tsyringe");
const config_service_1 = require("./api/v1/client/shared/services/config.service");
const logger_service_1 = require("./api/v1/client/shared/services/logger.service");
const domain_registry_1 = require("./api/v1/client/shared/domain/domain.registry");
const app_setup_1 = require("./setup/app.setup");
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.configService = tsyringe_1.container.resolve(config_service_1.ConfigService);
        this.logger = tsyringe_1.container.resolve(logger_service_1.LoggerService);
        this.domainRegistry = tsyringe_1.container.resolve(domain_registry_1.ControllerDomainRegistry);
        this.appSetup = new app_setup_1.AppSetup(this.app);
    }
    async start() {
        try {
            // Initialize application using AppSetup
            await this.appSetup.initialize();
            // Start the server
            await this.appSetup.start();
        }
        catch (error) {
            this.logger.error('Failed to start server:', { error });
            process.exit(1);
        }
    }
}
exports.App = App;
// Create and start the application
const app = new App();
app.start().catch(console.error);
exports.default = app;
