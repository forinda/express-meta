"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigService = void 0;
const singleton_decorator_1 = require("../../../../../decorators/singleton.decorator");
const logger_service_1 = require("./logger.service");
let ConfigService = class ConfigService {
    constructor() {
        this.config = this.loadConfig();
    }
    loadConfig() {
        // In a real application, you would load this from environment variables or a config file
        return {
            environment: process.env.NODE_ENV || 'development',
            logger: {
                level: process.env.LOG_LEVEL || logger_service_1.LogLevel.INFO,
                format: 'simple',
                transports: ['console'],
                filename: 'logs/app.log',
                maxSize: 10 * 1024 * 1024,
                maxFiles: 5
            },
            database: {
                host: process.env.DB_HOST || 'localhost',
                port: parseInt(process.env.DB_PORT || '5432', 10),
                username: process.env.DB_USERNAME || 'postgres',
                password: process.env.DB_PASSWORD || 'postgres',
                database: process.env.DB_NAME || 'express_meta',
                ssl: process.env.DB_SSL === 'true'
            },
            server: {
                port: parseInt(process.env.PORT || '3000', 10),
                host: process.env.HOST || 'localhost',
                cors: {
                    origin: process.env.CORS_ORIGIN || '*',
                    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
                    allowedHeaders: ['Content-Type', 'Authorization']
                }
            },
            swagger: {
                title: 'Express Meta API',
                description: 'API documentation for Express Meta application',
                version: '1.0.0',
                path: '/api-docs'
            }
        };
    }
    get(key) {
        return this.config[key];
    }
    getLoggerConfig() {
        return this.config.logger;
    }
    getDatabaseConfig() {
        return this.config.database;
    }
    getServerConfig() {
        return this.config.server;
    }
    getSwaggerConfig() {
        return this.config.swagger;
    }
    getEnvironment() {
        return this.config.environment;
    }
    isDevelopment() {
        return this.config.environment === 'development';
    }
    isProduction() {
        return this.config.environment === 'production';
    }
    isTest() {
        return this.config.environment === 'test';
    }
};
exports.ConfigService = ConfigService;
exports.ConfigService = ConfigService = __decorate([
    (0, singleton_decorator_1.Singleton)(),
    __metadata("design:paramtypes", [])
], ConfigService);
