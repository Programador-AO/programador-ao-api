import { DynamicModule, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import authConfig from '../../config/auth.config';
import { UsuarioModule } from '../usuarios/usuario-module';
import { AuthController } from './controllers/auth-controller';
import { AuthGuard } from './guards/auth-guard';
import { AuthService } from './services/auth-service';

@Module({
  providers: [],
  imports: [],
  exports: [],
  controllers: [],
})
export class AuthModule {
  static forRoot(): DynamicModule {
    return {
      module: AuthModule,
      providers: [
        AuthService,
        {
          provide: APP_GUARD,
          useClass: AuthGuard,
        },
      ],
      imports: [
        UsuarioModule,
        JwtModule.register({
          global: true,
          secret: authConfig().jwtSecret,
          signOptions: { expiresIn: authConfig().jwtExpire },
        }),
      ],
      exports: [AuthService],
      controllers: [AuthController],
    };
  }
}
