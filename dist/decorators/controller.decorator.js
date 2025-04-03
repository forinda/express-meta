"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Patch = exports.Delete = exports.Put = exports.Post = exports.Get = void 0;
exports.Controller = Controller;
exports.ApiTags = ApiTags;
exports.Body = Body;
exports.Res = Res;
exports.Req = Req;
const tsyringe_1 = require("tsyringe");
const express_1 = require("express");
const request_context_1 = require("../context/request.context");
function Controller(path = '') {
    return function (target) {
        (0, tsyringe_1.injectable)()(target);
        // Add router property to the controller
        target.prototype.router = (0, express_1.Router)();
        target.prototype.path = path;
    };
}
function ApiTags(...tags) {
    return function (target) {
        // Store tags metadata
        const metadata = Reflect.getMetadata('swagger', target) || {};
        metadata.tags = tags;
        Reflect.defineMetadata('swagger', metadata, target);
    };
}
function createRouteDecorator(method) {
    return function (path = '') {
        return function (target, propertyKey, descriptor) {
            const originalMethod = descriptor.value;
            descriptor.value = function (req, res) {
                const context = new request_context_1.ExpressRequestContext(req, res, req.params, req.query, req.body, req.user // For authentication
                );
                return originalMethod.apply(this, [context]);
            };
            // Access router from the prototype
            if (!target.prototype.router) {
                target.prototype.router = (0, express_1.Router)();
            }
            // Store the method and path for later use
            const routeMetadata = Reflect.getMetadata('routes', target.prototype) || [];
            routeMetadata.push({ method, path, propertyKey });
            Reflect.defineMetadata('routes', routeMetadata, target.prototype);
            // Bind the method to the router
            target.prototype.router[method](path, descriptor.value.bind(target.prototype));
        };
    };
}
exports.Get = createRouteDecorator('get');
exports.Post = createRouteDecorator('post');
exports.Put = createRouteDecorator('put');
exports.Delete = createRouteDecorator('delete');
exports.Patch = createRouteDecorator('patch');
// Parameter decorators
function Body() {
    return function (target, propertyKey, parameterIndex) {
        const metadata = Reflect.getMetadata('parameters', target, propertyKey) || {};
        metadata[parameterIndex] = { type: 'body' };
        Reflect.defineMetadata('parameters', metadata, target, propertyKey);
    };
}
function Res() {
    return function (target, propertyKey, parameterIndex) {
        const metadata = Reflect.getMetadata('parameters', target, propertyKey) || {};
        metadata[parameterIndex] = { type: 'response' };
        Reflect.defineMetadata('parameters', metadata, target, propertyKey);
    };
}
function Req() {
    return function (target, propertyKey, parameterIndex) {
        const metadata = Reflect.getMetadata('parameters', target, propertyKey) || {};
        metadata[parameterIndex] = { type: 'request' };
        Reflect.defineMetadata('parameters', metadata, target, propertyKey);
    };
}
