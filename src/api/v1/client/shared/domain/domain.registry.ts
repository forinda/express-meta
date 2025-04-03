import { container } from 'tsyringe';
import { Singleton } from '@/decorators/singleton.decorator';

/**
 * Domain registry for managing controllers and their metadata
 */
@Singleton()
export class ControllerDomainRegistry {
  private controllers: any[] = [];

  /**
   * Register a controller
   * @param controller Controller class
   */
  registerController(controller: any): void {
    this.controllers.push(controller);
    container.register(controller.name, { useClass: controller });
  }

  /**
   * Get all registered controllers
   * @returns Array of controller classes
   */
  getControllers(): any[] {
    return this.controllers;
  }
} 