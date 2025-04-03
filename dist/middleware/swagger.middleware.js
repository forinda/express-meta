"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerMiddleware = void 0;
const swagger_decorator_1 = require("../decorators/swagger.decorator");
/**
 * Middleware to serve Swagger documentation
 * This middleware is used to serve the Swagger documentation in JSON format
 * The Swagger UI is served by the setupSwagger function in swagger.setup.ts
 */
const swaggerMiddleware = (req, res, next) => {
    if (req.path === '/api-docs.json') {
        res.json((0, swagger_decorator_1.getSwaggerDocument)());
    }
    else {
        next();
    }
};
exports.swaggerMiddleware = swaggerMiddleware;
