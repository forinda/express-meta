import { Module } from './decorators/module.decorator';
import { UserController } from './controllers/UserController';
import { UserService } from './services/UserService';
import { ConfigService } from './api/v1/client/shared/services/config.service';
import { LoggerService } from './api/v1/client/shared/services/logger.service';
import { CookieService } from './api/v1/client/shared/services/cookie.service';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    ConfigService,
    LoggerService,
    CookieService
  ]
})
export class AppModule {} 