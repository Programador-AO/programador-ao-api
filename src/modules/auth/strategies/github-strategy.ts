import { Strategy } from 'passport-github';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { StrategyService } from '../services/strategy.service';
import appConfig from '@config/app.config';
import authConfig from '@config/auth.config';

const { githubClientId, githubClientSecret, githubCallbackURL } = authConfig();
const { apiDomain } = appConfig();

interface Profile {
  id: string;
  displayName: string;
  username: string;
  profileUrl: string;
  photos: string;
  provider: string;
  _json: {
    login: string;
    id: string;
    node_id: string;
    avatar_url: string;
    name: string;
    location: string;
    email: string;
  };
}

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private strategyService: StrategyService) {
    super({
      clientID: githubClientId,
      clientSecret: githubClientSecret,
      callbackURL: `${apiDomain}${githubCallbackURL}`,
      scope: ['read:user'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: any,
  ) {
    const { id } = profile;
    const { email, login, name, avatar_url } = profile._json;

    const provider = 'github';
    const access = {
      accessToken,
      refreshToken,
      provider,
      providerId: id,
    };

    // Verificar se o provider existe
    const usuarioVerificado =
      await this.strategyService.verificarActualizarUsuario({
        provider,
        providerId: id,
        name,
        avatar: avatar_url,
      });

    if (usuarioVerificado)
      return done(null, { ...access, usuarioId: usuarioVerificado.id });

    // Verificar se o email existe e criar o provider
    const emailUsuarioVerificado =
      await this.strategyService.verificarEmailUsuario({
        provider,
        providerId: id,
        email,
      });

    if (emailUsuarioVerificado)
      return done(null, { ...access, usuarioId: emailUsuarioVerificado.id });

    // Criar o usuario e o provider
    const resultUsuario = await this.strategyService.criarNovoUsuarioProvider({
      nomeCompleto: name,
      login,
      email,
      emailVerificado: !!email,
      avatar: avatar_url,
      tipo: 'MEMBRO',
      provider,
      providerId: id,
    });

    return done(null, { ...access, usuarioId: resultUsuario.id });
  }
}
