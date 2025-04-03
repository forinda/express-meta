"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwaggerRegistry = exports.SWAGGER_SECURITY_KEY = exports.SWAGGER_RESPONSES_KEY = exports.SWAGGER_PARAMETERS_KEY = exports.SWAGGER_OPERATION_KEY = exports.SWAGGER_TAGS_KEY = exports.SWAGGER_METADATA_KEY = void 0;
exports.ApiMetadata = ApiMetadata;
exports.ApiTags = ApiTags;
exports.ApiOperation = ApiOperation;
exports.ApiParameter = ApiParameter;
exports.ApiResponse = ApiResponse;
exports.ApiSecurity = ApiSecurity;
exports.getSwaggerDocument = getSwaggerDocument;
require("reflect-metadata");
const tsyringe_1 = require("tsyringe");
const logger_service_1 = require("../api/v1/client/shared/services/logger.service");
// Define metadata keys
exports.SWAGGER_METADATA_KEY = 'swagger:metadata';
exports.SWAGGER_TAGS_KEY = 'swagger:tags';
exports.SWAGGER_OPERATION_KEY = 'swagger:operation';
exports.SWAGGER_PARAMETERS_KEY = 'swagger:parameters';
exports.SWAGGER_RESPONSES_KEY = 'swagger:responses';
exports.SWAGGER_SECURITY_KEY = 'swagger:security';
// Singleton class to manage Swagger documentation
class SwaggerRegistry {
    constructor() {
        this.metadata = {};
        this.tags = new Map();
        this.paths = new Map();
        this.logger = tsyringe_1.container.resolve(logger_service_1.LoggerService);
    }
    static getInstance() {
        if (!SwaggerRegistry.instance) {
            SwaggerRegistry.instance = new SwaggerRegistry();
        }
        return SwaggerRegistry.instance;
    }
    setMetadata(metadata) {
        this.metadata = { ...this.metadata, ...metadata };
    }
    addTag(tag) {
        this.tags.set(tag.name, tag);
    }
    addPath(path, method, operation) {
        if (!this.paths.has(path)) {
            this.paths.set(path, new Map());
        }
        this.paths.get(path)?.set(method.toLowerCase(), operation);
    }
    getMetadata() {
        return this.metadata;
    }
    getTags() {
        return Array.from(this.tags.values());
    }
    getPaths() {
        return this.paths;
    }
    generateSwaggerDocument() {
        const paths = {};
        this.paths.forEach((methods, path) => {
            this.logger.info(`Generating Swagger document for path: ${path}`);
            paths[path] = {};
            methods.forEach((operation, method) => {
                paths[path][method] = {
                    summary: operation.summary,
                    description: operation.description,
                    tags: operation.tags || [],
                    parameters: operation.parameters,
                    responses: operation.responses?.reduce((acc, response) => {
                        acc[response.status] = {
                            description: response.description,
                            schema: response.schema
                        };
                        return acc;
                    }, {}),
                    security: operation.security
                };
            });
        });
        return {
            openapi: '3.0.0',
            info: {
                title: this.metadata.title || 'API Documentation',
                description: this.metadata.description,
                version: this.metadata.version || '1.0.0'
            },
            tags: this.getTags(),
            paths
        };
    }
}
exports.SwaggerRegistry = SwaggerRegistry;
// Decorators
function ApiMetadata(metadata) {
    return (target) => {
        Reflect.defineMetadata(exports.SWAGGER_METADATA_KEY, metadata, target);
        SwaggerRegistry.getInstance().setMetadata(metadata);
    };
}
function ApiTags(tags) {
    return (target) => {
        const tagArray = Array.isArray(tags) ? tags : [tags];
        tagArray.forEach(tag => {
            SwaggerRegistry.getInstance().addTag({ name: tag });
        });
        Reflect.defineMetadata(exports.SWAGGER_TAGS_KEY, tagArray, target);
    };
}
function ApiOperation(operation) {
    // console.log({operation});
    return (target, propertyKey, descriptor) => {
        const metadata = { operation };
        SwaggerRegistry.getInstance().addPath(Reflect.getMetadata('path', target.constructor) || '', Reflect.getMetadata('method', target, propertyKey) || '', operation);
        Reflect.defineMetadata(exports.SWAGGER_OPERATION_KEY, metadata, target, propertyKey);
    };
}
function ApiParameter(parameter) {
    return (target, propertyKey, parameterIndex) => {
        if (propertyKey === undefined)
            return;
        const metadata = SwaggerRegistry.getInstance().getMetadata().parameters || [];
        metadata[parameterIndex] = parameter;
        SwaggerRegistry.getInstance().getMetadata().parameters = metadata;
        Reflect.defineMetadata(exports.SWAGGER_PARAMETERS_KEY, metadata, target, propertyKey);
    };
}
function ApiResponse(response) {
    return (target, propertyKey, descriptor) => {
        const metadata = SwaggerRegistry.getInstance().getMetadata().responses || [];
        metadata.push(response);
        SwaggerRegistry.getInstance().getMetadata().responses = metadata;
        Reflect.defineMetadata(exports.SWAGGER_RESPONSES_KEY, metadata, target, propertyKey);
    };
}
function ApiSecurity(security) {
    return (target, propertyKey, descriptor) => {
        const metadata = SwaggerRegistry.getInstance().getMetadata().security || [];
        metadata.push(...security);
        SwaggerRegistry.getInstance().getMetadata().security = metadata;
        Reflect.defineMetadata(exports.SWAGGER_SECURITY_KEY, metadata, target, propertyKey);
    };
}
// Helper function to get Swagger documentation
function getSwaggerDocument() {
    return SwaggerRegistry.getInstance().generateSwaggerDocument();
}
