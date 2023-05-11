import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { isEmpty } from 'class-validator';

import { SessionRepository } from '../../../database/prisma/repositories/session-repository';
import { UsuarioRepository } from '../../../database/prisma/repositories/usuario-repository';
import { LoginResponseInterface } from '../interfaces/auth-interface';

@Injectable()
export class LoginGithubService {
  constructor(
    private usuarioRepository: UsuarioRepository,
    private sessionRepository: SessionRepository,
    private jwtService: JwtService,
  ) {}

  async execute(usuarioId: string): Promise<LoginResponseInterface> {
    if (isEmpty(usuarioId))
      throw new BadRequestException('usuarioId: Campo obrigatório');

    const usuario = await this.usuarioRepository.getById(usuarioId);

    if (!usuario) throw new NotFoundException();

    // const session = await this.sessionRepository.findOne({
    //   where: { usuario: usuario.id },
    // });

    // const session = await this.sessionRepository.findOne({
    //   where: { usuario: usuario.id },
    // });
    // if (session) throw new BadRequestException('Usuário já está logado');

    if (!usuario.activo) throw new BadRequestException('Usuário desativado');

    const payload = {
      id: usuario.id,
      nomeUsuario: usuario.nomeUsuario,
      email: usuario.email,
      telefone: usuario.telefone,
    };

    return {
      usuario: {
        ...payload,
        nomeCompleto: usuario.nomeCompleto,
        avatar: usuario.avatar,
      },
      token: await this.jwtService.signAsync(payload),
    };
  }
}
