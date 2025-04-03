"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupPlugins = setupPlugins;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
/**
 * Setup application plugins and middleware
 * @param app Express application
 * @param configService Configuration service
 */
function setupPlugins(app, configService) {
    const serverConfig = configService.getServerConfig();
    // Body parser
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    // CORS
    app.use((0, cors_1.default)({
        origin: serverConfig.cors.origin,
        methods: serverConfig.cors.methods,
        allowedHeaders: serverConfig.cors.allowedHeaders,
        credentials: true // Enable credentials for cookies
    }));
    // Cookie parser
    app.use((0, cookie_parser_1.default)());
    // Security headers
    app.use((0, helmet_1.default)());
    // Compression
    app.use((0, compression_1.default)());
    // Logging
    if (configService.isDevelopment()) {
        app.use((0, morgan_1.default)('dev'));
    }
    else {
        app.use((0, morgan_1.default)('combined'));
    }
}
