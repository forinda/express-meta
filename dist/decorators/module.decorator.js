"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Module = Module;
const tsyringe_1 = require("tsyringe");
function Module(options) {
    return function (target) {
        // Register controllers
        if (options.controllers) {
            options.controllers.forEach(controller => {
                tsyringe_1.container.register(controller, { useClass: controller });
            });
        }
        // Register providers
        if (options.providers) {
            options.providers.forEach(provider => {
                tsyringe_1.container.register(provider, { useClass: provider });
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
