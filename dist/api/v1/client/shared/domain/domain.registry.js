"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControllerDomainRegistry = void 0;
const tsyringe_1 = require("tsyringe");
const singleton_decorator_1 = require("../../../../../decorators/singleton.decorator");
/**
 * Domain registry for managing controllers and their metadata
 */
let ControllerDomainRegistry = class ControllerDomainRegistry {
    constructor() {
        this.controllers = [];
    }
    /**
     * Register a controller
     * @param controller Controller class
     */
    registerController(controller) {
        this.controllers.push(controller);
        tsyringe_1.container.register(controller.name, { useClass: controller });
    }
    /**
     * Get all registered controllers
     * @returns Array of controller classes
     */
    getControllers() {
        return this.controllers;
    }
};
exports.ControllerDomainRegistry = ControllerDomainRegistry;
exports.ControllerDomainRegistry = ControllerDomainRegistry = __decorate([
    (0, singleton_decorator_1.Singleton)()
], ControllerDomainRegistry);
