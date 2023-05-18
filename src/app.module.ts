import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';

import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { UsuarioModule } from './modules/usuarios/usuario-module';
import { RedirectHomeMiddleware } from './middlewares/redirect-home.middleware';

import appConfig from './config/app.config';
import securityConfig from './config/security.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot(securityConfig()),
    DevtoolsModule.register({
      http: appConfig().environment !== 'production',
    }),
    AuthModule.forRoot(),
    UsuarioModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RedirectHomeMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.GET });
  }
}
