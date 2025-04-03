"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupUserRoutes = setupUserRoutes;
const tsyringe_1 = require("tsyringe");
const user_controller_1 = require("../controllers/user.controller");
const validate_request_middleware_1 = require("../../shared/middleware/validate-request.middleware");
const schemas_1 = require("../schemas");
function setupUserRoutes() {
    console.log('setupUserRoutes');
    const userController = tsyringe_1.container.resolve(user_controller_1.UserController);
    // Use the controller's router
    if (!userController.router) {
        throw new Error('UserController router is not initialized');
    }
    // Add validation middleware to the routes
    const routes = userController.router.stack;
    console.log({ routes });
    routes.forEach((route) => {
        if (route.route) {
            const path = route.route.path;
            const methods = Object.keys(route.route.methods)
                .filter(method => route.route.methods[method])
                .map(method => method.toUpperCase());
            // Add validation middleware based on the route
            if (path === '/' && methods.includes('GET')) {
                // Add query validation for GET /
                const originalStack = route.route.stack;
                route.route.stack = [
                    { handle: (0, validate_request_middleware_1.validateRequest)(schemas_1.querySchema, 'query') },
                    ...originalStack
                ];
            }
            else if (path === '/' && methods.includes('POST')) {
                // Add body validation for POST /
                const originalStack = route.route.stack;
                route.route.stack = [
                    { handle: (0, validate_request_middleware_1.validateRequest)(schemas_1.createUserSchema) },
                    ...originalStack
                ];
            }
            else if (path === '/:id' && methods.includes('GET')) {
                // Add params validation for GET /:id
                const originalStack = route.route.stack;
                route.route.stack = [
                    { handle: (0, validate_request_middleware_1.validateRequest)(schemas_1.paramsSchema, 'params') },
                    ...originalStack
                ];
            }
            else if (path === '/:id' && methods.includes('PUT')) {
                // Add params and body validation for PUT /:id
                const originalStack = route.route.stack;
                route.route.stack = [
                    { handle: (0, validate_request_middleware_1.validateRequest)(schemas_1.paramsSchema, 'params') },
                    { handle: (0, validate_request_middleware_1.validateRequest)(schemas_1.updateUserSchema) },
                    ...originalStack
                ];
            }
            else if (path === '/:id' && methods.includes('DELETE')) {
                // Add params validation for DELETE /:id
                const originalStack = route.route.stack;
                route.route.stack = [
                    { handle: (0, validate_request_middleware_1.validateRequest)(schemas_1.paramsSchema, 'params') },
                    ...originalStack
                ];
            }
        }
    });
    return userController.router;
}
// For backward compatibility
exports.default = setupUserRoutes();
