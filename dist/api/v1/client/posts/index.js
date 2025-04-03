"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupPostRoutes = setupPostRoutes;
const container_1 = require("../../../../container");
const post_controller_1 = require("./controllers/post.controller");
const api_error_1 = require("../shared/errors/api.error");
/**
 * Setup post routes
 * @returns Express router with post routes
 */
function setupPostRoutes() {
    // Resolve the PostController from the container
    const postController = container_1.container.get(post_controller_1.PostController);
    // Check if the router is initialized
    if (!postController.router) {
        throw new api_error_1.ApiError(500, 'Post controller router not initialized');
    }
    return postController.router;
}
// For backward compatibility
exports.default = setupPostRoutes;
