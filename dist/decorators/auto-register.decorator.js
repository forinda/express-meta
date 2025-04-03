"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoRegister = AutoRegister;
require("reflect-metadata");
const inversify_1 = require("inversify");
const container_1 = require("../container");
/**
 * Decorator that automatically registers a class with inversify
 * @param options Configuration options for the decorator
 * @param options.identifier Optional identifier for the class. If not provided, the class itself is used as the identifier.
 * @param options.autoBind Whether to automatically bind dependencies. Defaults to false.
 */
function AutoRegister(options = {}) {
    return function (target) {
        // Apply the injectable decorator
        (0, inversify_1.injectable)()(target);
        // Register the class with inversify
        const id = options.identifier || target;
        container_1.container.bind(id).to(target).inSingletonScope();
        // If autoBind is enabled, automatically bind dependencies
        if (options.autoBind) {
            // Get the constructor parameters
            const paramTypes = Reflect.getMetadata('design:paramtypes', target) || [];
            // For each parameter, bind it to the container if it's not already bound
            paramTypes.forEach((paramType) => {
                if (paramType && typeof paramType === 'function') {
                    // Check if the type is already bound
                    if (!container_1.container.isBound(paramType)) {
                        container_1.container.bind(paramType).to(paramType).inSingletonScope();
                    }
                }
            });
        }
        return target;
    };
}
