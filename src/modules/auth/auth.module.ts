import { DynamicModule, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import authConfig from '../../config/auth.config';
import { UsuarioModule } from '../usuarios/usuario-module';
import { AuthController } from './controllers/auth.controller';
import { AuthGuard } from './guards/auth.guard';

import { AlterarDadosAutenticacaoService } from './services/alterar-dados-autenticacao.service';
import { AlterarSenhaService } from './services/alterar-senha.service';
import { EsqueciMinhaSenhaService } from './services/esqueci-minha-senha.service';
import { FirebaseService } from './services/firebase.service';
import { LoginProviderService } from './services/login-provider.service';
import { LoginSenhaService } from './services/login-senha.service';
import { RecuperarMinhaSenhaService } from './services/recuperar-minha-senha.service';
import { RedefinirSenhaService } from './services/redefinir-senha.service';
import { RegistrarEmailTelefoneSenhaService } from './services/registrar-email-telefone-senha.service';
import { VerificacaoEmailService } from './services/verificacao-email.service';

import { GithubStrategy } from './strategies/github-strategy';
import { GoogleStrategy } from './strategies/google-strategy';
import { StrategyService } from './services/strategy.service';

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
        LoginProviderService,
        RegistrarEmailTelefoneSenhaService,
        AlterarSenhaService,
        AlterarDadosAutenticacaoService,
        VerificacaoEmailService,
        EsqueciMinhaSenhaService,
        RecuperarMinhaSenhaService,
        RedefinirSenhaService,
        StrategyService,
        {
          provide: APP_GUARD,
          useClass: AuthGuard,
        },
        FirebaseService,
        GoogleStrategy,
        GithubStrategy,
      ],
      imports: [
        UsuarioModule,
        PassportModule,
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
