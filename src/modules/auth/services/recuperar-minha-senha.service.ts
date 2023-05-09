import { BadRequestException, Injectable } from '@nestjs/common';
import { isEmpty } from 'class-validator';

import { SessionRepository } from '../../../database/prisma/repositories/session-repository';
import { UsuarioRepository } from '../../../database/prisma/repositories/usuario-repository';
import authConfig from '../../../config/auth.config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RecuperarMinhaSenhaService {
  constructor(
    private usuarioRepository: UsuarioRepository,
    private sessionRepository: SessionRepository,
    private jwtService: JwtService,
  ) {}

  async execute(token: string) {
    if (isEmpty(token)) throw new BadRequestException('Token inválidos');

    const payload = await this.jwtService.verifyAsync(token, {
      secret: authConfig().jwtSecret,
    });

    if (payload && payload.email && payload.id && payload.codigo) {
      const usuario = await this.usuarioRepository.getById(payload.id);

      if (
        usuario &&
        usuario.email === payload.email &&
        usuario.tokenRecuperarSenha === token
      ) {
        const codigo = payload.codigo;
        return { codigo };
      }
    }

    throw new BadRequestException('Token inválido ou expirado.');
  }
}
