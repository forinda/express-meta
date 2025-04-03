import { Response } from 'express';
import { Singleton } from '@/decorators/singleton.decorator';
import { ConfigService } from './config.service';

export interface CookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  maxAge?: number;
  path?: string;
  domain?: string;
}

@Singleton()
export class CookieService {
  private defaultOptions: CookieOptions;

  constructor(private configService: ConfigService) {
    this.defaultOptions = {
      httpOnly: true,
      secure: configService.isProduction(),
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      path: '/'
    };
  }

  /**
   * Set a cookie in the response
   * @param res Express response object
   * @param name Cookie name
   * @param value Cookie value
   * @param options Cookie options
   */
  setCookie(
    res: Response,
    name: string,
    value: string,
    options: Partial<CookieOptions> = {}
  ): void {
    const cookieOptions = { ...this.defaultOptions, ...options };
    res.cookie(name, value, cookieOptions);
  }

  /**
   * Clear a cookie from the response
   * @param res Express response object
   * @param name Cookie name
   * @param options Cookie options
   */
  clearCookie(res: Response, name: string, options: Partial<CookieOptions> = {}): void {
    const cookieOptions = {
      ...this.defaultOptions,
      ...options,
      maxAge: 0
    };
    res.clearCookie(name, cookieOptions);
  }

  /**
   * Set a session cookie
   * @param res Express response object
   * @param sessionId Session ID
   */
  setSessionCookie(res: Response, sessionId: string): void {
    this.setCookie(res, 'session', sessionId);
  }

  /**
   * Clear a session cookie
   * @param res Express response object
   */
  clearSessionCookie(res: Response): void {
    this.clearCookie(res, 'session');
  }
} 