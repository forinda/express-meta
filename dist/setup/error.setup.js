"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupErrorHandling = setupErrorHandling;
/**
 * Setup error handling middleware
 * @param app Express application
 * @param logger Logger service
 */
function setupErrorHandling(app, logger) {
    // 404 handler
    app.use((req, res) => {
        logger.warn(`404 Not Found: ${req.method} ${req.path}`);
        res.status(404).json({
            status: 'error',
            message: 'Not Found'
        });
    });
    // Error handler
    app.use((err, req, res, next) => {
        logger.error('Unhandled error:', err);
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'
        });
    });
}
