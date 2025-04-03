"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainRegistry = void 0;
const tsyringe_1 = require("tsyringe");
const fs_1 = require("fs");
const path_1 = require("path");
const domain_registry_1 = require("./client/shared/domain/domain.registry");
class DomainRegistry {
    constructor() {
        this.controllers = new Map();
        this.domains = new Set();
    }
    static getInstance() {
        if (!DomainRegistry.instance) {
            DomainRegistry.instance = new DomainRegistry();
        }
        return DomainRegistry.instance;
    }
    findControllerFiles(dir) {
        const files = [];
        const items = (0, fs_1.readdirSync)(dir);
        for (const item of items) {
            console.log({ item });
            const fullPath = (0, path_1.join)(dir, item);
            const stat = (0, fs_1.statSync)(fullPath);
            if (stat.isDirectory()) {
                files.push(...this.findControllerFiles(fullPath));
            }
            else if (stat.isFile() &&
                (item.endsWith('.controller.ts') || item.endsWith('.controller.js'))) {
                files.push(fullPath);
            }
        }
        return files;
    }
    async registerDomain(domainPath) {
        try {
            const controllerFiles = this.findControllerFiles(domainPath);
            for (const file of controllerFiles) {
                const controllerModule = await Promise.resolve(`${file}`).then(s => __importStar(require(s)));
                const controllerClass = Object.values(controllerModule)[0];
                if (controllerClass) {
                    const controllerName = controllerClass.name;
                    this.controllers.set(controllerName, controllerClass);
                    this.domains.add(domainPath);
                }
            }
        }
        catch (error) {
            console.error(`Error registering domain at ${domainPath}:`, error);
        }
    }
    getControllerInstances() {
        const instances = [];
        for (const Controller of this.controllers.values()) {
            try {
                const instance = tsyringe_1.container.resolve(Controller);
                if (instance.path && instance.router) {
                    instances.push({
                        path: instance.path,
                        router: instance.router,
                    });
                }
            }
            catch (error) {
                console.error(`Error resolving controller ${Controller.name}:`, error);
            }
        }
        return instances;
    }
    getDomains() {
        return Array.from(this.domains);
    }
    getControllerDomainRegistry() {
        return tsyringe_1.container.resolve(domain_registry_1.ControllerDomainRegistry);
    }
}
exports.DomainRegistry = DomainRegistry;
