import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { isEmpty } from 'class-validator';

import { SessionRepository } from '../../../database/prisma/repositories/session-repository';
import { UsuarioRepository } from '../../../database/prisma/repositories/usuario-repository';
import { JwtService } from '@nestjs/jwt';
import authConfig from '../../../config/auth.config';

@Injectable()
export class RedefinirSenhaService {
  constructor(
    private usuarioRepository: UsuarioRepository,
    private sessionRepository: SessionRepository,
    private jwtService: JwtService,
  ) {}

  async execute(
    email: string,
    codigo: string,
    senhaNova: string,
  ): Promise<void> {
    if (isEmpty(email))
      throw new BadRequestException('email: Campo obrigatório.');

    if (isEmpty(codigo))
      throw new BadRequestException('codigo: Campo obrigatório.');

    if (isEmpty(senhaNova))
      throw new BadRequestException('nova_senha: Campo obrigatório.');

    const usuario = await this.usuarioRepository.getByEmail(email);
    if (!usuario) throw new NotFoundException('Usuário não encontrado.');

    const payload = await this.jwtService.verifyAsync(
      usuario.tokenRecuperarSenha ?? '',
      {
        secret: authConfig().jwtSecret,
      },
    );

    if (payload.codigo !== codigo)
      throw new BadRequestException('Código de verificação inválido.');

    const senhaHash = await bcrypt.hash(senhaNova, 8);
    const updated = await this.usuarioRepository.update(usuario.id, {
      ...usuario,
      senhaHash,
      tokenRecuperarSenha: null,
    });

    if (!updated)
      throw new BadRequestException('Erro ao atualizar a senha do usuário.');
  }
}
