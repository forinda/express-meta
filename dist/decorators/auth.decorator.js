"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = Auth;
const tsyringe_1 = require("tsyringe");
const logger_service_1 = require("../api/v1/client/shared/services/logger.service");
function Auth(options = { required: true }) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (req, res, next) {
            const logger = tsyringe_1.container.resolve(logger_service_1.LoggerService);
            const cookieName = options.cookieName || 'session';
            // Check if the session cookie exists
            const sessionCookie = req.cookies[cookieName];
            if (!sessionCookie && options.required) {
                logger.warn(`Authentication failed: No ${cookieName} cookie found`, {
                    path: req.path,
                    method: req.method,
                    ip: req.ip
                });
                if (options.redirectTo) {
                    return res.redirect(options.redirectTo);
                }
                return res.status(401).json({
                    message: 'Authentication required',
                    error: 'Unauthorized'
                });
            }
            // Add the session to the request object for use in the controller
            req.session = sessionCookie;
            // Call the original method
            return originalMethod.apply(this, [req, res, next]);
        };
        return descriptor;
    };
}
