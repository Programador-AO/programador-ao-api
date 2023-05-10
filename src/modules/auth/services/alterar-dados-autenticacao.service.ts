import { BadRequestException, Injectable } from '@nestjs/common';
import { isEmail, isEmpty } from 'class-validator';

import { SessionRepository } from '../../../database/prisma/repositories/session-repository';
import { UsuarioRepository } from '../../../database/prisma/repositories/usuario-repository';
import { isValidNomeUsuario } from '../../../helpers/username-helper';
import { UsuarioInterface } from '../../usuarios/interfaces/usuario-interface';

@Injectable()
export class AlterarDadosAutenticacaoService {
  constructor(
    private usuarioRepository: UsuarioRepository,
    private sessionRepository: SessionRepository,
  ) {}

  async execute(id: string, data: UsuarioInterface) {
    const dadosValidos = await this.validarRegistro(id, data);

    await this.usuarioRepository.update(id, {
      ...dadosValidos,
    });
  }

  private async validarRegistro(id: string, data: UsuarioInterface) {
    const { nomeCompleto, nomeUsuario, email, telefone } = data;

    if (isEmpty(nomeCompleto))
      throw new BadRequestException('nome_completo: Campo obrigatório');

    if (isEmpty(nomeUsuario))
      throw new BadRequestException('nome_usuario: Campo obrigatório');

    if (isEmpty(email))
      throw new BadRequestException('email: Campo obrigatório');

    if (isEmpty(telefone))
      throw new BadRequestException('telefone: Campo obrigatório');

    if (!isEmail(email)) throw new BadRequestException('Email inválido');

    if (!isValidNomeUsuario(nomeUsuario))
      throw new BadRequestException(
        'Nome de usuário inválido. (aceita apenas letras[a-z, A-Z], números[0-9], sublinhados (_) e traços (-))',
      );

    const emailExiste = await this.usuarioRepository.getByEmail(email);
    if (emailExiste && emailExiste.id !== id)
      throw new BadRequestException('Email já cadastrado');

    const telefoneExiste = await this.usuarioRepository.getByTelefone(telefone);
    if (telefoneExiste && telefoneExiste.id !== id)
      throw new BadRequestException('Telefone já cadastrado');

    const usuarioNomeExiste = await this.usuarioRepository.getByNomeUsuario(
      nomeUsuario,
    );
    if (usuarioNomeExiste && usuarioNomeExiste.id !== id)
      throw new BadRequestException('Nome de usuário já cadastrado');

    const usuario = await this.usuarioRepository.getById(id ?? '');

    if (usuario?.email !== email) {
      await this.removerSessao(id ?? '');
      data.emailVerificado = false;
    }

    if (usuario?.telefone !== telefone) {
      await this.removerSessao(id ?? '');
      data.telefoneVerificado = false;
    }

    if (usuario?.nomeUsuario !== nomeUsuario) {
      await this.removerSessao(id ?? '');
    }

    return data;
  }

  private async removerSessao(usuarioId: string) {
    const session = await this.sessionRepository.getByUsuarioId(usuarioId);
    if (session) {
      await this.sessionRepository.delete(session.id);
    }
  }
}
