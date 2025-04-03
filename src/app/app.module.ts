import { container } from 'tsyringe';
import { Application } from 'express';
import express from 'express';
import { AppSetup } from '@/setup/app.setup';

/**
 * Application module for setting up Express application
 */
export class AppModule {
  private app: Application;
  private appSetup: AppSetup;

  constructor() {
    // Create Express application
    this.app = express();

    // Create app setup
    this.appSetup = new AppSetup(this.app);
  }

  /**
   * Initialize the application
   */
  async initialize(): Promise<void> {
    await this.appSetup.initialize();
  }

  /**
   * Get the Express application instance
   */
  getApp(): Application {
    return this.app;
  }

  /**
   * Start the application
   */
  async start(): Promise<void> {
    await this.appSetup.start();
  }
} 