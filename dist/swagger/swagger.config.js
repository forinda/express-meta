"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerConfig = void 0;
const swagger_decorator_1 = require("../decorators/swagger.decorator");
exports.swaggerConfig = {
    openapi: '3.0.0',
    info: {
        title: 'Express Meta API',
        version: '1.0.0',
        description: 'API documentation for Express Meta application',
        contact: {
            name: 'API Support',
            email: 'support@example.com'
        }
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Development server'
        }
    ],
    tags: swagger_decorator_1.SwaggerRegistry.getInstance().getTags(),
    paths: swagger_decorator_1.SwaggerRegistry.getInstance().getPaths(),
    components: {
        securitySchemes: {
            Bearer: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        }
    }
};
