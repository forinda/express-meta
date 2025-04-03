import { Server } from 'http';
import { Application } from 'express';
import { container } from 'tsyringe';
import { ConfigService } from '../api/v1/client/shared/services/config.service';
import { LoggerService } from '../api/v1/client/shared/services/logger.service';
import { SocketService } from '../api/v1/client/shared/services/socket.service';

/**
 * Server module for handling HTTP and Socket.IO servers
 */
export class ServerModule {
  private httpServer: Server;
  private configService: ConfigService;
  private logger: LoggerService;
  private socketService: SocketService;

  constructor(app: Application) {
    this.configService = container.resolve(ConfigService);
    this.logger = container.resolve(LoggerService);
    this.socketService = container.resolve(SocketService);

    // Create HTTP server
    this.httpServer = require('http').createServer(app);
  }

  /**
   * Start the servers
   */
  async start(): Promise<void> {
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
  async stop(): Promise<void> {
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