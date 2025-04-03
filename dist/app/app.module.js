"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const express_1 = __importDefault(require("express"));
const app_setup_1 = require("../setup/app.setup");
/**
 * Application module for setting up Express application
 */
class AppModule {
    constructor() {
        // Create Express application
        this.app = (0, express_1.default)();
        // Create app setup
        this.appSetup = new app_setup_1.AppSetup(this.app);
    }
    /**
     * Initialize the application
     */
    async initialize() {
        await this.appSetup.initialize();
    }
    /**
     * Get the Express application instance
     */
    getApp() {
        return this.app;
    }
    /**
     * Start the application
     */
    async start() {
        await this.appSetup.start();
    }
}
exports.AppModule = AppModule;
