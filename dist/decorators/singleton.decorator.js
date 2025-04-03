"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Singleton = Singleton;
const tsyringe_1 = require("tsyringe");
const tsyringe_2 = require("tsyringe");
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
function Singleton() {
    return function (target) {
        // Apply the injectable decorator
        (0, tsyringe_2.injectable)()(target);
        // Register the class as a singleton in the container
        tsyringe_1.container.registerSingleton(target);
        return target;
    };
}
