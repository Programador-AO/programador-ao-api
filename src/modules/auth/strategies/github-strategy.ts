import { Strategy } from 'passport-github';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import appConfig from '../../../config/app.config';
import authConfig from '../../../config/auth.config';
import { UsuarioRepository } from '../../../database/prisma/repositories/usuario-repository';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private usuarioRepository: UsuarioRepository,
    private jwtService: JwtService,
  ) {
    const { githubClientId, githubClientSecret } = authConfig();
    const { apiDomain } = appConfig();

    super({
      clientID: githubClientId,
      clientSecret: githubClientSecret,
      callbackURL: `${apiDomain}/v1/auth/github/callback`,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ) {
    // console.log(profile);
    // return;
    // if (!profile) throw new UnauthorizedException();
    // const { username, displayName, avatarUrl, email } = profile._json;
    // let usuario = email
    //   ? await this.usuarioRepository.getByEmail(email)
    //   : await this.usuarioRepository.getByNomeUsuario(username);
    // if (!usuario) {
    //   usuario = await this.usuarioRepository.create({
    //     nomeCompleto: displayName,
    //     nomeUsuario: usuarioNomeExiste ? null : username,
    //     email,
    //     senhaHash: '',
    //     avatar: avatarUrl,
    //   });
    // }
    // if (!usuario) throw new UnauthorizedException();
    // const payload = {
    //   id: usuario?.id,
    //   nomeUsuario: usuario?.nomeUsuario,
    //   email: usuario?.email,
    //   telefone: usuario?.telefone,
    // };
    // const access = {
    //   usuario: {
    //     nomeCompleto: usuario?.nomeCompleto,
    //     id: usuario?.id,
    //     nomeUsuario: usuario?.nomeUsuario,
    //     email: usuario?.email,
    //     telefone: usuario?.telefone,
    //     avatar: usuario?.avatar,
    //   },
    //   token: await this.jwtService.signAsync(payload),
    // };
    // done(null, access);
  }
}
