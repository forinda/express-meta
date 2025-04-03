import { injectable } from 'tsyringe';
import { Router, Request, Response } from 'express';
import { ExpressRequestContext } from '../context/request.context';

export function Controller(path: string = '') {
  return function (target: any) {
    injectable()(target);
    
    // Add router property to the controller
    target.prototype.router = Router();
    target.prototype.path = path;
  };
}

export function ApiTags(...tags: string[]) {
  return function (target: any) {
    // Store tags metadata
    const metadata = Reflect.getMetadata('swagger', target) || {};
    metadata.tags = tags;
    Reflect.defineMetadata('swagger', metadata, target);
  };
}

function createRouteDecorator(method: string) {
  return function (path: string = '') {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
      const originalMethod = descriptor.value;
      descriptor.value = function (req: Request, res: Response) {
        const context = new ExpressRequestContext(
          req,
          res,
          req.params,
          req.query,
          req.body,
          (req as any).user // For authentication
        );
        return originalMethod.apply(this, [context]);
      };
      
      // Access router from the prototype
      if (!target.prototype.router) {
        target.prototype.router = Router();
      }
      
      // Store the method and path for later use
      const routeMetadata = Reflect.getMetadata('routes', target.prototype) || [];
      routeMetadata.push({ method, path, propertyKey });
      Reflect.defineMetadata('routes', routeMetadata, target.prototype);
      
      // Bind the method to the router
      target.prototype.router[method](path, descriptor.value.bind(target.prototype));
    };
  };
}

export const Get = createRouteDecorator('get');
export const Post = createRouteDecorator('post');
export const Put = createRouteDecorator('put');
export const Delete = createRouteDecorator('delete');
export const Patch = createRouteDecorator('patch');

// Parameter decorators
export function Body() {
  return function (target: any, propertyKey: string, parameterIndex: number) {
    const metadata = Reflect.getMetadata('parameters', target, propertyKey) || {};
    metadata[parameterIndex] = { type: 'body' };
    Reflect.defineMetadata('parameters', metadata, target, propertyKey);
  };
}

export function Res() {
  return function (target: any, propertyKey: string, parameterIndex: number) {
    const metadata = Reflect.getMetadata('parameters', target, propertyKey) || {};
    metadata[parameterIndex] = { type: 'response' };
    Reflect.defineMetadata('parameters', metadata, target, propertyKey);
  };
}

export function Req() {
  return function (target: any, propertyKey: string, parameterIndex: number) {
    const metadata = Reflect.getMetadata('parameters', target, propertyKey) || {};
    metadata[parameterIndex] = { type: 'request' };
    Reflect.defineMetadata('parameters', metadata, target, propertyKey);
  };
} 