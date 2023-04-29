import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { isEmpty } from 'class-validator';

import { SessionRepository } from '../../../database/prisma/repositories/session-repository';
import { UsuarioRepository } from '../../../database/prisma/repositories/usuario-repository';

@Injectable()
export class AlterarSenhaService {
  constructor(
    private usuarioRepository: UsuarioRepository,
    private sessionRepository: SessionRepository,
  ) {}

  async execute(
    usuarioId: string,
    senhaAntiga: string,
    senhaNova: string,
  ): Promise<void> {
    if (isEmpty(senhaAntiga))
      throw new BadRequestException('senha_antiga: Campo obrigatório.');

    if (isEmpty(senhaNova))
      throw new BadRequestException('senha_nova: Campo obrigatório.');

    const usuario = await this.usuarioRepository.getById(usuarioId);
    if (!usuario) throw new BadRequestException('Usuário não existe');
    if (!usuario.activo) throw new BadRequestException('Usuário desativado.');

    const senhaValida = await bcrypt.compare(senhaAntiga, usuario.senhaHash);
    if (!senhaValida) throw new BadRequestException('Senha antiga inválida.');

    const senhaHash = await bcrypt.hash(senhaNova, 8);

    await this.usuarioRepository.updateSenha(usuarioId, senhaHash);
  }
}
