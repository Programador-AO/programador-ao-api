import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-google-oauth20';
import { StrategyService } from '../services/strategy.service';

import appConfig from '@config/app.config';
import authConfig from '@config/auth.config';
import { PassportStrategy } from '@nestjs/passport';

const { googleClientId, googleClientSecret, googleCallbackURL } = authConfig();
const { apiDomain } = appConfig();

interface Profile {
  _json: {
    sub: string;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    email: string;
    email_verified: boolean;
  };
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private strategyService: StrategyService) {
    super({
      clientID: googleClientId,
      clientSecret: googleClientSecret,
      callbackURL: `${apiDomain}${googleCallbackURL}`,
      passReqToCallback: true,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    request: any,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: any,
  ) {
    const { sub, email, given_name, family_name, picture, email_verified } =
      profile._json;

    const provider = 'google';
    const nomeCompleto = `${given_name} ${family_name}`;
    const access = {
      accessToken,
      refreshToken,
      provider,
      providerId: sub,
    };

    // Verificar se o provider existe
    const usuarioVerificado =
      await this.strategyService.verificarActualizarUsuario({
        provider,
        providerId: sub,
        name: nomeCompleto,
        avatar: picture,
      });

    if (usuarioVerificado)
      return done(null, { ...access, usuarioId: usuarioVerificado.id });

    // Verificar se o email existe e criar o provider
    const emailUsuarioVerificado =
      await this.strategyService.verificarEmailUsuario({
        provider,
        providerId: sub,
        email,
      });

    if (emailUsuarioVerificado)
      return done(null, { ...access, usuarioId: emailUsuarioVerificado.id });

    // Criar o usuario e o provider
    const resultUsuario = await this.strategyService.criarNovoUsuarioProvider({
      nomeCompleto,
      login: nomeCompleto,
      email,
      emailVerificado: email_verified,
      avatar: picture,
      tipo: 'MEMBRO',
      provider,
      providerId: sub,
    });

    return done(null, { ...access, usuarioId: resultUsuario.id });
  }
}
