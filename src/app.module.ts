import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { UsuarioModule } from './modules/usuarios/usuario-module';
import { FirebaseAuthModule } from '@whitecloak/nestjs-passport-firebase';
import { APP_GUARD } from '@nestjs/core';
import firebaseConfig from './config/firebase.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    FirebaseAuthModule.register({
      audience: firebaseConfig().projectId,
      issuer: firebaseConfig().firebaseIssuer,
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
export class AppModule {}
