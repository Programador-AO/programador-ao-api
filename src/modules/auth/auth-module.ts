import { DynamicModule, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import authConfig from '../../config/auth.config';
import { UsuarioModule } from '../usuarios/usuario-module';
import { AuthController } from './controllers/auth-controller';
import { AuthGuard } from './guards/auth-guard';

import { LoginSenhaService } from './services/login-senha-service';
import { AlterarSenhaService } from './services/alterar-senha-service';
import { VerificacaoEmailService } from './services/verificacao-email-service';
import { AlterarDadosAutenticacaoService } from './services/alterar-dados-autenticacao-service';
import { RegistrarEmailTelefoneSenhaService } from './services/registrar-email-telefone-senha-service';

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
        LoginSenhaService,
        RegistrarEmailTelefoneSenhaService,
        AlterarSenhaService,
        AlterarDadosAutenticacaoService,
        VerificacaoEmailService,
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
      // exports: [
      //   LoginSenhaService,
      //   RegistrarEmailTelefoneSenhaService,
      //   AlterarSenhaService,
      // ],
      controllers: [AuthController],
    };
  }
}
