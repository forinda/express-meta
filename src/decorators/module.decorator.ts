import { container } from 'tsyringe';

export interface ModuleOptions {
  controllers?: any[];
  providers?: any[];
  imports?: any[];
}

export function Module(options: ModuleOptions) {
  return function (target: any) {
    // Register controllers
    if (options.controllers) {
      options.controllers.forEach(controller => {
        container.register(controller, { useClass: controller });
      });
    }

    // Register providers
    if (options.providers) {
      options.providers.forEach(provider => {
        container.register(provider, { useClass: provider });
      });
    }

    // Handle imports
    if (options.imports) {
      options.imports.forEach(module => {
        // This will trigger the module decorator of imported modules
        new module();
      });
    }
  };
} 