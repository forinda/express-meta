"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupUserRoutes = setupUserRoutes;
const container_1 = require("../../../../container");
const user_controller_1 = require("./controllers/user.controller");
const api_error_1 = require("../shared/errors/api.error");
/**
 * Setup user routes
 * @returns Express router with user routes
 */
function setupUserRoutes() {
    // Resolve the UserController from the container
    const userController = container_1.container.get(user_controller_1.UserController);
    // Check if the router is initialized
    if (!userController.router) {
        throw new api_error_1.ApiError(500, 'User controller router not initialized');
    }
    return userController.router;
}
// For backward compatibility
exports.default = setupUserRoutes;
