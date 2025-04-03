declare module '@/decorators/singleton.decorator' {
  export function Singleton(): ClassDecorator;
}

declare module '@/api/v1/client/shared/services/logger.service' {
  export class LoggerService {
    constructor();
    error(message: string, meta?: Record<string, any>): void;
    warn(message: string, meta?: Record<string, any>): void;
    info(message: string, meta?: Record<string, any>): void;
    debug(message: string, meta?: Record<string, any>): void;
    http(message: string, meta?: Record<string, any>): void;
  }
}

declare module '@/api/v1/client/shared/services/config.service' {
  export class ConfigService {
    constructor();
    get<T>(key: string): T;
    isProduction(): boolean;
    isDevelopment(): boolean;
  }
}

declare module '@/api/v1/client/shared/services/cookie.service' {
  import { Response } from 'express';
  export interface CookieOptions {
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
    maxAge?: number;
    path?: string;
    domain?: string;
  }
  export class CookieService {
    constructor(configService: any);
    setCookie(res: Response, name: string, value: string, options?: Partial<CookieOptions>): void;
    clearCookie(res: Response, name: string, options?: Partial<CookieOptions>): void;
    setSessionCookie(res: Response, sessionId: string): void;
    clearSessionCookie(res: Response): void;
  }
}

declare module '@/api/v1/client/shared/services/socket.service' {
  import { Server as SocketServer } from 'socket.io';
  export class SocketService {
    constructor(logger: any, configService: any);
    initialize(httpServer: any): void;
    getIO(): SocketServer | null;
    emit(event: string, data: any): void;
    emitToRoom(room: string, event: string, data: any): void;
  }
}

declare module '@/api/v1/client/shared/domain/domain.registry' {
  export class DomainRegistry {
    constructor();
    registerController(controller: any): void;
    getControllers(): any[];
  }
} 