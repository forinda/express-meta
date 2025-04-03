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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerService = exports.LogLevel = void 0;
const winston_1 = __importDefault(require("winston"));
const singleton_decorator_1 = require("../../../../../decorators/singleton.decorator");
var LogLevel;
(function (LogLevel) {
    LogLevel["ERROR"] = "error";
    LogLevel["WARN"] = "warn";
    LogLevel["INFO"] = "info";
    LogLevel["DEBUG"] = "debug";
    LogLevel["HTTP"] = "http";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
let LoggerService = class LoggerService {
    constructor() {
        // Set default log level based on environment
        const defaultLevel = process.env.NODE_ENV === 'production' ? 'info' : 'debug';
        this.logger = winston_1.default.createLogger({
            level: defaultLevel,
            format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
            transports: [
                new winston_1.default.transports.Console({
                    format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.simple())
                })
            ]
        });
        this.options = {
            level: defaultLevel === 'debug' ? LogLevel.DEBUG : LogLevel.INFO,
            format: 'simple',
            transports: ['console'],
            filename: 'logs/app.log',
            maxSize: 10 * 1024 * 1024, // 10MB
            maxFiles: 5
        };
        // Log the current log level
        this.info(`Logger initialized with level: ${defaultLevel}`);
    }
    initializeLogger() {
        const { level, format, transports, filename, maxSize, maxFiles } = this.options;
        // Configure format
        const formatConfig = this.getFormatConfig(format);
        // Configure transports
        const transportConfigs = transports.map(transport => {
            if (transport === 'console') {
                return new winston_1.default.transports.Console({
                    level,
                    format: formatConfig
                });
            }
            else if (transport === 'file') {
                return new winston_1.default.transports.File({
                    filename,
                    level,
                    format: formatConfig,
                    maxsize: maxSize,
                    maxFiles
                });
            }
            return null;
        }).filter(Boolean);
        // Create logger
        this.logger = winston_1.default.createLogger({
            level,
            format: formatConfig,
            transports: transportConfigs
        });
    }
    getFormatConfig(format) {
        switch (format) {
            case 'json':
                return winston_1.default.format.json();
            case 'pretty':
                return winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.timestamp(), winston_1.default.format.printf((info) => {
                    const { timestamp, level, message, ...meta } = info;
                    return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
                }));
            case 'simple':
            default:
                return winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.printf((info) => {
                    const { timestamp, level, message, ...meta } = info;
                    return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
                }));
        }
    }
    error(message, meta) {
        this.logger.error(message, meta);
    }
    warn(message, meta) {
        this.logger.warn(message, meta);
    }
    info(message, meta) {
        this.logger.info(message, meta);
    }
    debug(message, meta) {
        this.logger.debug(message, meta);
    }
    http(message, meta) {
        this.logger.http(message, meta);
    }
    // Method to update logger options at runtime
    updateOptions(options) {
        this.options = { ...this.options, ...options };
        this.initializeLogger();
    }
};
exports.LoggerService = LoggerService;
exports.LoggerService = LoggerService = __decorate([
    (0, singleton_decorator_1.Singleton)(),
    __metadata("design:paramtypes", [])
], LoggerService);
