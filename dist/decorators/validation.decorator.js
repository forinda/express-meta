"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
exports.validateQuery = validateQuery;
exports.validateParams = validateParams;
const zod_1 = require("zod");
const tsyringe_1 = require("tsyringe");
const logger_service_1 = require("../api/v1/client/shared/services/logger.service");
/**
 * Decorator for validating request body against a Zod schema
 */
function validate(schema) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (req, res, next) {
            const logger = tsyringe_1.container.resolve(logger_service_1.LoggerService);
            try {
                // Validate the request body against the schema
                const validatedData = await schema.parseAsync(req.body);
                // Replace the request body with the validated data
                req.body = validatedData;
                // Call the original method
                return originalMethod.apply(this, [req, res, next]);
            }
            catch (error) {
                if (error instanceof zod_1.z.ZodError) {
                    logger.warn('Validation error', {
                        path: req.path,
                        method: req.method,
                        errors: error.errors
                    });
                    return res.status(400).json({
                        message: 'Validation error',
                        errors: error.errors.map(err => ({
                            path: err.path.join('.'),
                            message: err.message
                        }))
                    });
                }
                // If it's not a Zod error, pass it to the next error handler
                return next(error);
            }
        };
        return descriptor;
    };
}
/**
 * Decorator for validating request query parameters against a Zod schema
 */
function validateQuery(schema) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (req, res, next) {
            const logger = tsyringe_1.container.resolve(logger_service_1.LoggerService);
            try {
                // Validate the request query against the schema
                const validatedData = await schema.parseAsync(req.query);
                // Replace the request query with the validated data
                req.query = validatedData;
                // Call the original method
                return originalMethod.apply(this, [req, res, next]);
            }
            catch (error) {
                if (error instanceof zod_1.z.ZodError) {
                    logger.warn('Query validation error', {
                        path: req.path,
                        method: req.method,
                        errors: error.errors
                    });
                    return res.status(400).json({
                        message: 'Query validation error',
                        errors: error.errors.map(err => ({
                            path: err.path.join('.'),
                            message: err.message
                        }))
                    });
                }
                // If it's not a Zod error, pass it to the next error handler
                return next(error);
            }
        };
        return descriptor;
    };
}
/**
 * Decorator for validating request parameters against a Zod schema
 */
function validateParams(schema) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (req, res, next) {
            const logger = tsyringe_1.container.resolve(logger_service_1.LoggerService);
            try {
                // Validate the request parameters against the schema
                const validatedData = await schema.parseAsync(req.params);
                // Replace the request parameters with the validated data
                req.params = validatedData;
                // Call the original method
                return originalMethod.apply(this, [req, res, next]);
            }
            catch (error) {
                if (error instanceof zod_1.z.ZodError) {
                    logger.warn('Parameter validation error', {
                        path: req.path,
                        method: req.method,
                        errors: error.errors
                    });
                    return res.status(400).json({
                        message: 'Parameter validation error',
                        errors: error.errors.map(err => ({
                            path: err.path.join('.'),
                            message: err.message
                        }))
                    });
                }
                // If it's not a Zod error, pass it to the next error handler
                return next(error);
            }
        };
        return descriptor;
    };
}
