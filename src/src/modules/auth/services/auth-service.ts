import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';

import { UsuarioService } from '../../usuarios/services/usuario-service';
import { UsuarioInterface } from '../../usuarios/interfaces/usuario-interface';
import { LoginEmailPasswordResponseInterface } from '../interfaces/auth-interface';
import { UsuarioRepository } from '../../../database/prisma/repositories/usuario-reposytory';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuarioService,
    private usuarioRepository: UsuarioRepository,
    private jwtService: JwtService,
  ) {}

  async loginEmailPassword(
    email: string,
    senha: string,
  ): Promise<LoginEmailPasswordResponseInterface> {
    if (!email) throw new BadRequestException('Email não informado');
    if (!senha) throw new BadRequestException('Senha não informada');

    const usuario = await this.usuarioRepository.getByEmail(email);
    if (!usuario) throw new NotFoundException();

    const senhaValida = await bcrypt.compare(senha, usuario.senhaHash);
    if (!senhaValida) {
      throw new UnauthorizedException();
    }

    const payload = {
      id: usuario.id,
      nomeUsuario: usuario.nomeUsuario,
      email: usuario.email,
      telefone: usuario.email,
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

  async registerEmailSenha(data: UsuarioInterface): Promise<void> {
    const senhaHash = await bcrypt.hash(data.senhaHash, 8);
    await this.usuarioService.create({ ...data, senhaHash });
  }
}
