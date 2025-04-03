"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = setupSwagger;
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_decorator_1 = require("../decorators/swagger.decorator");
/**
 * Setup Swagger documentation
 * @param app Express application
 * @param configService Configuration service
 * @param logger Logger service
 * @param controllerDomainRegistry Domain registry for collecting metadata
 */
function setupSwagger(app, configService, logger, controllerDomainRegistry) {
    const serverConfig = configService.getServerConfig();
    // Create Swagger document
    const swaggerDocument = {
        openapi: '3.0.0',
        info: {
            title: 'Express Meta API',
            version: '1.0.0',
            description: 'API documentation for Express Meta application'
        },
        servers: [
            {
                url: `http://localhost:${serverConfig.port}`,
                description: 'Development server'
            }
        ],
        components: {
            securitySchemes: {
                cookieAuth: {
                    type: 'apiKey',
                    in: 'cookie',
                    name: 'session',
                    description: 'Cookie-based authentication'
                },
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [
            {
                cookieAuth: [],
                bearerAuth: []
            }
        ],
        tags: [],
        paths: {
            '/api/v1/users': {
                get: {
                    summary: 'Get all users',
                    description: 'Get all users from the database',
                    responses: {
                        200: {
                            description: 'Users fetched successfully',
                            content: {
                                'application/json': {
                                    schema: { type: 'array', items: { $ref: '#/components/schemas/User' } }
                                }
                            }
                        }
                    }
                }
            }
        }
    };
    console.log(JSON.stringify(swaggerDocument.paths, null, 2));
    // Collect metadata from controllers
    const controllers = controllerDomainRegistry.getControllers();
    const tags = new Set();
    controllers.forEach((controller) => {
        const metadata = Reflect.getMetadata('swagger', controller);
        if (metadata?.tags) {
            metadata.tags.forEach((tag) => tags.add(tag));
        }
    });
    // Add tags to Swagger document
    tags.forEach(tag => {
        swaggerDocument.tags.push({
            name: tag,
            description: `${tag} operations`
        });
    });
    // Get paths from SwaggerRegistry
    const swaggerDoc = (0, swagger_decorator_1.getSwaggerDocument)();
    //   console.log(swaggerDoc);
    swaggerDocument.paths = swaggerDoc.paths || {};
    // Merge tags from SwaggerRegistry
    const registryTags = swaggerDoc.tags || [];
    registryTags.forEach((tag) => {
        if (!tags.has(tag.name)) {
            swaggerDocument.tags.push({
                name: tag.name,
                description: tag.description || `${tag.name} operations`
            });
        }
    });
    // Serve Swagger documentation
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument, {
        explorer: true,
        swaggerOptions: {
            persistAuthorization: true
        }
    }));
    logger.info(`Swagger documentation available at http://localhost:${serverConfig.port}/api-docs`);
}
