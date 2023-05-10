import { Strategy } from 'passport-github';
import { Injectable, BadRequestException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import appConfig from '@config/app.config';
import authConfig from '@config/auth.config';
import { UsuarioRepository } from '@database/prisma/repositories/usuario-repository';
import { AutenticacaoProviderRepository } from '@database/prisma/repositories/autenticacao-provider-repository';

import { formatUsername, isValidNomeUsuario } from '@helpers/username-helper';

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
  constructor(
    private usuarioRepository: UsuarioRepository,
    private autenticacaoProviderRepository: AutenticacaoProviderRepository,
  ) {
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

    const access = {
      accessToken,
      refreshToken,
      provider: 'github',
      providerId: id,
    };

    const authProvider =
      await this.autenticacaoProviderRepository.getByUsuarioProviderId(
        'github',
        id,
      );

    // #region Regras caso o provider exista
    if (authProvider) {
      const usuario = await this.usuarioRepository.getById(
        authProvider.usuarioId,
      );

      if (usuario) {
        if (usuario.nomeCompleto !== name || usuario.avatar !== avatar_url) {
          const result = await this.usuarioRepository.update(usuario.id, {
            ...usuario,
            nomeCompleto: name,
            avatar: avatar_url,
          });

          if (!result)
            throw new BadRequestException(
              'Não foi possível autenticar o usuário',
            );
        }

        return done(null, { ...access, usuarioId: usuario.id });
      }
    }
    //#endregion

    //#region Regras caso o provider não exista mas já exista um usuário com o email
    if (email) {
      const usuario = await this.usuarioRepository.getByEmail(email);

      if (usuario) {
        const result = await this.autenticacaoProviderRepository.create({
          provider: 'github',
          usuarioId: usuario.id,
          usuarioProviderId: id,
          email,
        });

        if (!result)
          throw new BadRequestException(
            'Não foi possível autenticar o usuário',
          );

        return done(null, { ...access, usuarioId: usuario.id });
      }
    }
    // #endregion

    // #region Regras caso o provider não exista nem exista um usuário com o email
    // Verificar se o nome é válido
    let nomeUsuario = login ?? name;
    const nomeValido = isValidNomeUsuario(nomeUsuario);
    if (!nomeValido) nomeUsuario = formatUsername(nomeUsuario);

    // Verificar se o nome existe se já existe e gerar um nome caso exista
    nomeUsuario = await this.sugerirNovoNomeUsuario(nomeUsuario);
    const usuario = await this.usuarioRepository.create({
      nomeCompleto: name,
      nomeUsuario,
      email,
      emailVerificado: !!email,
      avatar: avatar_url,
      tipo: 'MEMBRO',
    });

    if (usuario) {
      const result = await this.autenticacaoProviderRepository.create({
        provider: 'github',
        usuarioId: usuario.id,
        usuarioProviderId: id,
        email,
      });

      if (!result)
        throw new BadRequestException('Não foi possível autenticar o usuário');
    }

    return done(null, { ...access, usuarioId: usuario.id });
    // #endregion
  }

  sugerirNovoNomeUsuario = async (nomeUsuario: string): Promise<string> => {
    let novoNomeUsuario = nomeUsuario;
    const usernameExists = true;
    let counter = 1;

    while (usernameExists) {
      const usuario = await this.usuarioRepository.getByNomeUsuario(
        novoNomeUsuario,
      );

      if (!usuario) return novoNomeUsuario;

      novoNomeUsuario = `${nomeUsuario}${counter}`;
      counter++;
    }

    return novoNomeUsuario;
  };
}
