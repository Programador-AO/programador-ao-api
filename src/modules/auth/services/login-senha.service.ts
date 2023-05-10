import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { isEmpty } from 'class-validator';

import { SessionRepository } from '../../../database/prisma/repositories/session-repository';
import { UsuarioRepository } from '../../../database/prisma/repositories/usuario-repository';
import { LoginEmailPasswordResponseInterface } from '../interfaces/auth-interface';

@Injectable()
export class LoginSenhaService {
  constructor(
    private usuarioRepository: UsuarioRepository,
    private sessionRepository: SessionRepository,
    private jwtService: JwtService,
  ) {}

  async execute(
    login: string,
    senha: string,
  ): Promise<LoginEmailPasswordResponseInterface> {
    if (isEmpty(login))
      throw new BadRequestException('login: Campo obrigatório');

    if (isEmpty(senha))
      throw new BadRequestException('senha: Campo obrigatório');

    let usuario = await this.usuarioRepository.getByEmail(login);

    if (!usuario) usuario = await this.usuarioRepository.getByTelefone(login);

    if (!usuario)
      usuario = await this.usuarioRepository.getByNomeUsuario(login);

    if (!usuario) throw new NotFoundException();

    // const session = await this.sessionRepository.findOne({
    //   where: { usuario: usuario.id },
    // });
    // if (session) throw new BadRequestException('Usuário já está logado');

    if (!usuario.activo) throw new BadRequestException('Usuário desativado');

    const senhaValida = await bcrypt.compare(senha, usuario.senhaHash ?? '');
    if (!senhaValida) throw new UnauthorizedException();

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
