import { Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { Body, Controller, Get, Post, Req, Res } from '@/decorators/controller.decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@/decorators/swagger.decorator';
import { CookieService } from '../../shared/services/cookie.service';
import { LoggerService } from '../../shared/services/logger.service';
import { Auth } from '@/decorators/auth.decorator';
import { z } from 'zod';
import { validate } from '@/decorators/validation.decorator';

// Validation schemas
const LoginSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6).max(100)
});

const RegisterSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6).max(100),
  email: z.string().email()
});

@injectable()
@Controller('/auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(
    private readonly cookieService: CookieService,
    private readonly logger: LoggerService
  ) {}

  @Post('/login')
  @ApiOperation({ summary: 'Login user', description: 'Authenticate user and set session cookie' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @validate(LoginSchema)
  async login(
    @Body() body: z.infer<typeof LoginSchema>,
    @Res() res: Response
  ): Promise<void> {
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
    } else {
      this.logger.warn(`Failed login attempt for user: ${username}`);
      
      res.status(401).json({
        message: 'Invalid credentials',
        error: 'Unauthorized'
      });
    }
  }

  @Post('/register')
  @ApiOperation({ summary: 'Register new user', description: 'Create a new user account' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @validate(RegisterSchema)
  async register(
    @Body() body: z.infer<typeof RegisterSchema>,
    @Res() res: Response
  ): Promise<void> {
    // In a real application, you would save the user to a database
    const { username, email } = body;
    
    this.logger.info(`New user registered: ${username} (${email})`);
    
    res.status(201).json({
      message: 'User registered successfully',
      user: { username, email }
    });
  }

  @Get('/logout')
  @ApiOperation({ summary: 'Logout user', description: 'Clear session cookie' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  @Auth({ required: false })
  async logout(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    // Clear the session cookie
    this.cookieService.clearSessionCookie(res);
    
    this.logger.info(`User logged out: ${req.session?.username || 'unknown'}`);
    
    res.status(200).json({
      message: 'Logout successful'
    });
  }

  @Get('/profile')
  @ApiOperation({ summary: 'Get user profile', description: 'Get the current user profile (requires authentication)' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @Auth()
  async getProfile(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    // In a real application, you would fetch the user profile from a database
    // For this example, we'll just return a mock profile
    res.status(200).json({
      username: 'admin',
      email: 'admin@example.com',
      role: 'administrator'
    });
  }
} 