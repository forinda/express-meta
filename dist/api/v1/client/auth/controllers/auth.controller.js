"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const tsyringe_1 = require("tsyringe");
const controller_decorator_1 = require("../../../../../decorators/controller.decorator");
const swagger_decorator_1 = require("../../../../../decorators/swagger.decorator");
const cookie_service_1 = require("../../shared/services/cookie.service");
const logger_service_1 = require("../../shared/services/logger.service");
const auth_decorator_1 = require("../../../../../decorators/auth.decorator");
const zod_1 = require("zod");
const validation_decorator_1 = require("../../../../../decorators/validation.decorator");
// Validation schemas
const LoginSchema = zod_1.z.object({
    username: zod_1.z.string().min(3).max(50),
    password: zod_1.z.string().min(6).max(100)
});
const RegisterSchema = zod_1.z.object({
    username: zod_1.z.string().min(3).max(50),
    password: zod_1.z.string().min(6).max(100),
    email: zod_1.z.string().email()
});
let AuthController = class AuthController {
    constructor(cookieService, logger) {
        this.cookieService = cookieService;
        this.logger = logger;
    }
    async login(body, res) {
        // In a real application, you would validate credentials against a database
        const { username, password } = body;
        // Example authentication logic
        if (username === 'admin' && password === 'password') {
            // Generate a session ID (in a real app, this would be a JWT or session token)
            const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
            // Set the session cookie
            this.cookieService.setSessionCookie(res, sessionId);
            this.logger.info(`User logged in: ${username}`);
            res.status(200).json({
                message: 'Login successful',
                user: { username }
            });
        }
        else {
            this.logger.warn(`Failed login attempt for user: ${username}`);
            res.status(401).json({
                message: 'Invalid credentials',
                error: 'Unauthorized'
            });
        }
    }
    async register(body, res) {
        // In a real application, you would save the user to a database
        const { username, email } = body;
        this.logger.info(`New user registered: ${username} (${email})`);
        res.status(201).json({
            message: 'User registered successfully',
            user: { username, email }
        });
    }
    async logout(req, res) {
        // Clear the session cookie
        this.cookieService.clearSessionCookie(res);
        this.logger.info(`User logged out: ${req.session?.username || 'unknown'}`);
        res.status(200).json({
            message: 'Logout successful'
        });
    }
    async getProfile(req, res) {
        // In a real application, you would fetch the user profile from a database
        // For this example, we'll just return a mock profile
        res.status(200).json({
            username: 'admin',
            email: 'admin@example.com',
            role: 'administrator'
        });
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, controller_decorator_1.Post)('/login'),
    (0, swagger_decorator_1.ApiOperation)({ summary: 'Login user', description: 'Authenticate user and set session cookie' }),
    (0, swagger_decorator_1.ApiResponse)({ status: 200, description: 'Login successful' }),
    (0, swagger_decorator_1.ApiResponse)({ status: 401, description: 'Invalid credentials' }),
    (0, validation_decorator_1.validate)(LoginSchema),
    __param(0, (0, controller_decorator_1.Body)()),
    __param(1, (0, controller_decorator_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [void 0, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, controller_decorator_1.Post)('/register'),
    (0, swagger_decorator_1.ApiOperation)({ summary: 'Register new user', description: 'Create a new user account' }),
    (0, swagger_decorator_1.ApiResponse)({ status: 201, description: 'User registered successfully' }),
    (0, swagger_decorator_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, validation_decorator_1.validate)(RegisterSchema),
    __param(0, (0, controller_decorator_1.Body)()),
    __param(1, (0, controller_decorator_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [void 0, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, controller_decorator_1.Get)('/logout'),
    (0, swagger_decorator_1.ApiOperation)({ summary: 'Logout user', description: 'Clear session cookie' }),
    (0, swagger_decorator_1.ApiResponse)({ status: 200, description: 'Logout successful' }),
    (0, auth_decorator_1.Auth)({ required: false }),
    __param(0, (0, controller_decorator_1.Req)()),
    __param(1, (0, controller_decorator_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, controller_decorator_1.Get)('/profile'),
    (0, swagger_decorator_1.ApiOperation)({ summary: 'Get user profile', description: 'Get the current user profile (requires authentication)' }),
    (0, swagger_decorator_1.ApiResponse)({ status: 200, description: 'Profile retrieved successfully' }),
    (0, swagger_decorator_1.ApiResponse)({ status: 401, description: 'Authentication required' }),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, controller_decorator_1.Req)()),
    __param(1, (0, controller_decorator_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
exports.AuthController = AuthController = __decorate([
    (0, tsyringe_1.injectable)(),
    (0, controller_decorator_1.Controller)('/auth'),
    (0, swagger_decorator_1.ApiTags)('Authentication'),
    __metadata("design:paramtypes", [cookie_service_1.CookieService,
        logger_service_1.LoggerService])
], AuthController);
