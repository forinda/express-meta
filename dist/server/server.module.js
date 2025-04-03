"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerModule = void 0;
const tsyringe_1 = require("tsyringe");
const config_service_1 = require("../api/v1/client/shared/services/config.service");
const logger_service_1 = require("../api/v1/client/shared/services/logger.service");
const socket_service_1 = require("../api/v1/client/shared/services/socket.service");
/**
 * Server module for handling HTTP and Socket.IO servers
 */
class ServerModule {
    constructor(app) {
        this.configService = tsyringe_1.container.resolve(config_service_1.ConfigService);
        this.logger = tsyringe_1.container.resolve(logger_service_1.LoggerService);
        this.socketService = tsyringe_1.container.resolve(socket_service_1.SocketService);
        // Create HTTP server
        this.httpServer = require('http').createServer(app);
    }
    /**
     * Start the servers
     */
    async start() {
        const serverConfig = this.configService.getServerConfig();
        // Initialize Socket.IO
        this.socketService.initialize(this.httpServer);
        // Start HTTP server
        this.httpServer.listen(serverConfig.port, () => {
            this.logger.info(`HTTP server is running on port ${serverConfig.port}`);
            this.logger.info(`Socket.IO server is running on ws://localhost:${serverConfig.port}`);
        });
    }
    /**
     * Stop the servers
     */
    async stop() {
        return new Promise((resolve) => {
            // Close Socket.IO server
            this.socketService.close().then(() => {
                // Close HTTP server
                this.httpServer.close(() => {
                    this.logger.info('HTTP server stopped');
                    resolve();
                });
            });
        });
    }
}
exports.ServerModule = ServerModule;
