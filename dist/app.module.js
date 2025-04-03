"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const module_decorator_1 = require("./decorators/module.decorator");
const UserController_1 = require("./controllers/UserController");
const UserService_1 = require("./services/UserService");
const config_service_1 = require("./api/v1/client/shared/services/config.service");
const logger_service_1 = require("./api/v1/client/shared/services/logger.service");
const cookie_service_1 = require("./api/v1/client/shared/services/cookie.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, module_decorator_1.Module)({
        controllers: [UserController_1.UserController],
        providers: [
            UserService_1.UserService,
            config_service_1.ConfigService,
            logger_service_1.LoggerService,
            cookie_service_1.CookieService
        ]
    })
], AppModule);
