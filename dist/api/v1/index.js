"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupRoutes = setupRoutes;
const express_1 = require("express");
const users_1 = require("./client/users");
const posts_1 = require("./client/posts");
/**
 * Setup all API routes
 * @param app Express application
 */
function setupRoutes(app) {
    const router = (0, express_1.Router)();
    // Mount API routes
    router.use('/users', (0, users_1.setupUserRoutes)());
    router.use('/posts', (0, posts_1.setupPostRoutes)());
    // Mount the API router
    app.use('/api/v1', router);
}
