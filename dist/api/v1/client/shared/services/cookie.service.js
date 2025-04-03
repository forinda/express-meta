"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CookieService = void 0;
const singleton_decorator_1 = require("../../../../../decorators/singleton.decorator");
const config_service_1 = require("./config.service");
let CookieService = class CookieService {
    constructor(configService) {
        this.configService = configService;
        this.defaultOptions = {
            httpOnly: true,
            secure: configService.isProduction(),
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            path: '/'
        };
    }
    /**
     * Set a cookie in the response
     * @param res Express response object
     * @param name Cookie name
     * @param value Cookie value
     * @param options Cookie options
     */
    setCookie(res, name, value, options = {}) {
        const cookieOptions = { ...this.defaultOptions, ...options };
        res.cookie(name, value, cookieOptions);
    }
    /**
     * Clear a cookie from the response
     * @param res Express response object
     * @param name Cookie name
     * @param options Cookie options
     */
    clearCookie(res, name, options = {}) {
        const cookieOptions = {
            ...this.defaultOptions,
            ...options,
            maxAge: 0
        };
        res.clearCookie(name, cookieOptions);
    }
    /**
     * Set a session cookie
     * @param res Express response object
     * @param sessionId Session ID
     */
    setSessionCookie(res, sessionId) {
        this.setCookie(res, 'session', sessionId);
    }
    /**
     * Clear a session cookie
     * @param res Express response object
     */
    clearSessionCookie(res) {
        this.clearCookie(res, 'session');
    }
};
exports.CookieService = CookieService;
exports.CookieService = CookieService = __decorate([
    (0, singleton_decorator_1.Singleton)(),
    __metadata("design:paramtypes", [config_service_1.ConfigService])
], CookieService);
