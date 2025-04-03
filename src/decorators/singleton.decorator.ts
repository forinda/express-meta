import { container } from 'tsyringe';
import { injectable } from 'tsyringe';

/**
 * Decorator to register a class as a singleton in the container
 * This combines @injectable() and automatic registration
 * 
 * @example
 * @Singleton()
 * export class MyService {
 *   // Service implementation
 * }
 */
export function Singleton() {
  return function (target: any) {
    // Apply the injectable decorator
    injectable()(target);
    
    // Register the class as a singleton in the container
    container.registerSingleton(target);
    
    return target;
  };
} 