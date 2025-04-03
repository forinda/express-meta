import 'reflect-metadata';
import { Request, Response } from 'express';
import { container, inject } from 'tsyringe';
import { LoggerService } from '@/api/v1/client/shared/services/logger.service';

// Define metadata keys
export const SWAGGER_METADATA_KEY = 'swagger:metadata';
export const SWAGGER_TAGS_KEY = 'swagger:tags';
export const SWAGGER_OPERATION_KEY = 'swagger:operation';
export const SWAGGER_PARAMETERS_KEY = 'swagger:parameters';
export const SWAGGER_RESPONSES_KEY = 'swagger:responses';
export const SWAGGER_SECURITY_KEY = 'swagger:security';

// Define interfaces for Swagger metadata
export interface SwaggerMetadata {
  title?: string;
  description?: string;
  version?: string;
  basePath?: string;
  tags?: SwaggerTag[];
  operation?: SwaggerOperation;
  parameters?: SwaggerParameter[];
  responses?: SwaggerResponse[];
  security?: SwaggerSecurity[];
}

export interface SwaggerTag {
  name: string;
  description?: string;
}

export interface SwaggerParameter {
  name: string;
  in: 'query' | 'header' | 'path' | 'cookie' | 'body';
  description?: string;
  required?: boolean;
  schema?: any;
}

export interface SwaggerResponse {
  status: number;
  description: string;
  schema?: any;
}

export interface SwaggerOperation {
  summary: string;
  description?: string;
  operationId?: string;
  parameters?: SwaggerParameter[];
  responses?: SwaggerResponse[];
  security?: SwaggerSecurity[];
  tags?: string[];
}

export interface SwaggerSecurity {
  name: string;
  scopes?: string[];
}

// Singleton class to manage Swagger documentation
export class SwaggerRegistry {
  private static instance: SwaggerRegistry;
  private metadata: SwaggerMetadata = {};
  private tags: Map<string, SwaggerTag> = new Map();
  private paths: Map<string, Map<string, SwaggerOperation>> = new Map();
  private logger: LoggerService;

  private constructor() {
    this.logger = container.resolve(LoggerService);
  }

  public static getInstance(): SwaggerRegistry {
    if (!SwaggerRegistry.instance) {
      SwaggerRegistry.instance = new SwaggerRegistry();
    }
    return SwaggerRegistry.instance;
  }

  public setMetadata(metadata: SwaggerMetadata): void {
    this.metadata = { ...this.metadata, ...metadata };
  }

  public addTag(tag: SwaggerTag): void {
    this.tags.set(tag.name, tag);
  }

  public addPath(path: string, method: string, operation: SwaggerOperation): void {
    if (!this.paths.has(path)) {
      this.paths.set(path, new Map());
    }
    this.paths.get(path)?.set(method.toLowerCase(), operation);
  }

  public getMetadata(): SwaggerMetadata {
    return this.metadata;
  }

  public getTags(): SwaggerTag[] {
    return Array.from(this.tags.values());
  }

  public getPaths(): Map<string, Map<string, SwaggerOperation>> {
    return this.paths;
  }

  public generateSwaggerDocument(): any {
    const paths: Record<string, any> = {};
    
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
          }, {} as Record<string, any>),
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

// Decorators
export function ApiMetadata(metadata: SwaggerMetadata): ClassDecorator {
  return (target: any) => {
    Reflect.defineMetadata(SWAGGER_METADATA_KEY, metadata, target);
    SwaggerRegistry.getInstance().setMetadata(metadata);
  };
}

export function ApiTags(tags: string | string[]): ClassDecorator {
  return (target: any) => {
    const tagArray = Array.isArray(tags) ? tags : [tags];
    tagArray.forEach(tag => {
      SwaggerRegistry.getInstance().addTag({ name: tag });
    });
    Reflect.defineMetadata(SWAGGER_TAGS_KEY, tagArray, target);
  };
}

export function ApiOperation(operation: SwaggerOperation): MethodDecorator {
  // console.log({operation});
  
  return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    const metadata: SwaggerMetadata = { operation };
    SwaggerRegistry.getInstance().addPath(Reflect.getMetadata('path', target.constructor) || '', Reflect.getMetadata('method', target, propertyKey) || '', operation);
    Reflect.defineMetadata(SWAGGER_OPERATION_KEY, metadata, target, propertyKey);
  };
}

export function ApiParameter(parameter: SwaggerParameter): ParameterDecorator {
  return (target: any, propertyKey: string | symbol | undefined, parameterIndex: number) => {
    if (propertyKey === undefined) return;
    
    const metadata = SwaggerRegistry.getInstance().getMetadata().parameters || [];
    metadata[parameterIndex] = parameter;
    SwaggerRegistry.getInstance().getMetadata().parameters = metadata;
    Reflect.defineMetadata(SWAGGER_PARAMETERS_KEY, metadata, target, propertyKey);
  };
}

export function ApiResponse(response: SwaggerResponse): MethodDecorator {
  
  return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    const metadata = SwaggerRegistry.getInstance().getMetadata().responses || [];
    metadata.push(response);
    SwaggerRegistry.getInstance().getMetadata().responses = metadata;
    Reflect.defineMetadata(SWAGGER_RESPONSES_KEY, metadata, target, propertyKey);
  };
}

export function ApiSecurity(security: SwaggerSecurity[]): MethodDecorator {
  return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    const metadata = SwaggerRegistry.getInstance().getMetadata().security || [];
    metadata.push(...security);
    SwaggerRegistry.getInstance().getMetadata().security = metadata;
    Reflect.defineMetadata(SWAGGER_SECURITY_KEY, metadata, target, propertyKey);
  };
}

// Helper function to get Swagger documentation
export function getSwaggerDocument(): any {
  return SwaggerRegistry.getInstance().generateSwaggerDocument();
} 