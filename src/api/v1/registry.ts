import { Router } from 'express';
import { container } from 'tsyringe';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';
import { ControllerDomainRegistry } from './client/shared/domain/domain.registry';

interface ControllerInstance {
  path: string;
  router: Router;
}

export class DomainRegistry {
  private static instance: DomainRegistry;
  private controllers: Map<string, any> = new Map();
  private domains: Set<string> = new Set();

  private constructor() {}

  static getInstance(): DomainRegistry {
    if (!DomainRegistry.instance) {
      DomainRegistry.instance = new DomainRegistry();
    }
    return DomainRegistry.instance;
  }

  private findControllerFiles(dir: string): string[] {
    const files: string[] = [];
    const items = readdirSync(dir);

    for (const item of items) {
      console.log({item});
      
      const fullPath = join(dir, item);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        files.push(...this.findControllerFiles(fullPath));
      } else if (
        stat.isFile() &&
        (item.endsWith('.controller.ts') || item.endsWith('.controller.js'))
      ) {
        files.push(fullPath);
      }
    }

    return files;
  }

  async registerDomain(domainPath: string): Promise<void> {
    try {
      const controllerFiles = this.findControllerFiles(domainPath);
      
      for (const file of controllerFiles) {
        const controllerModule = await import(file);
        const controllerClass = Object.values(controllerModule)[0] as any;
        
        if (controllerClass) {
          const controllerName = controllerClass.name;
          this.controllers.set(controllerName, controllerClass);
          this.domains.add(domainPath);
        }
      }
    } catch (error) {
      console.error(`Error registering domain at ${domainPath}:`, error);
    }
  }

  getControllerInstances(): ControllerInstance[] {
    const instances: ControllerInstance[] = [];

    for (const Controller of this.controllers.values()) {
      try {
        const instance = container.resolve(Controller) as { path: string; router: Router };
        if (instance.path && instance.router) {
          instances.push({
            path: instance.path,
            router: instance.router,
          });
        }
      } catch (error) {
        console.error(`Error resolving controller ${Controller.name}:`, error);
      }
    }

    return instances;
  }

  getDomains(): string[] {
    return Array.from(this.domains);
  }

  getControllerDomainRegistry(): ControllerDomainRegistry {
    return container.resolve(ControllerDomainRegistry);
  }
} 