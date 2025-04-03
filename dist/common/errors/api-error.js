"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = exports.HttpStatus = void 0;
var HttpStatus;
(function (HttpStatus) {
    HttpStatus[HttpStatus["OK"] = 200] = "OK";
    HttpStatus[HttpStatus["CREATED"] = 201] = "CREATED";
    HttpStatus[HttpStatus["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    HttpStatus[HttpStatus["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    HttpStatus[HttpStatus["FORBIDDEN"] = 403] = "FORBIDDEN";
    HttpStatus[HttpStatus["NOT_FOUND"] = 404] = "NOT_FOUND";
    HttpStatus[HttpStatus["CONFLICT"] = 409] = "CONFLICT";
    HttpStatus[HttpStatus["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
})(HttpStatus || (exports.HttpStatus = HttpStatus = {}));
class ApiError extends Error {
    constructor(message, statusCode = HttpStatus.INTERNAL_SERVER_ERROR, metadata, isOperational = true, details) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.metadata = metadata;
        this.isOperational = isOperational;
        this.details = details;
        // Capture stack trace
        Error.captureStackTrace(this, this.constructor);
    }
    toJSON() {
        return {
            name: this.name,
            message: this.message,
            statusCode: this.statusCode,
            metadata: this.metadata,
            stack: this.stack
        };
    }
}
exports.ApiError = ApiError;
