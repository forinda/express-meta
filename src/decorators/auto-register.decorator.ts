import 'reflect-metadata';
import { injectable } from 'inversify';
import { container } from '../container';

/**
 * Decorator that automatically registers a class with inversify
 * @param options Configuration options for the decorator
 * @param options.identifier Optional identifier for the class. If not provided, the class itself is used as the identifier.
 * @param options.autoBind Whether to automatically bind dependencies. Defaults to false.
 */
export function AutoRegister(options: { identifier?: string | symbol; autoBind?: boolean } = {}) {
  return function (target: any) {
    // Apply the injectable decorator
    injectable()(target);
    
    // Register the class with inversify
    const id = options.identifier || target;
    container.bind(id).to(target).inSingletonScope();
    
    // If autoBind is enabled, automatically bind dependencies
    if (options.autoBind) {
      // Get the constructor parameters
      const paramTypes = Reflect.getMetadata('design:paramtypes', target) || [];
      
      // For each parameter, bind it to the container if it's not already bound
      paramTypes.forEach((paramType: any) => {
        if (paramType && typeof paramType === 'function') {
          // Check if the type is already bound
          if (!container.isBound(paramType)) {
            container.bind(paramType).to(paramType).inSingletonScope();
          }
        }
      });
    }
    
    return target;
  };
} 