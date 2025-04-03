"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
/**
 * Custom API error class
 */
class ApiError extends Error {
    /**
     * Create a new API error
     * @param statusCode HTTP status code
     * @param message Error message
     * @param isOperational Whether the error is operational (expected) or programming (unexpected)
     */
    constructor(statusCode, message, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        // Capture stack trace
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.ApiError = ApiError;
