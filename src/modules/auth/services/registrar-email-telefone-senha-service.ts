import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { isEmail, isEmpty } from 'class-validator';

import { SessionRepository } from '../../../database/prisma/repositories/session-repository';
import { UsuarioRepository } from '../../../database/prisma/repositories/usuario-repository';
import { isValidNomeUsuario } from '../../../helpers/regex';
import { UsuarioInterface } from '../../usuarios/interfaces/usuario-interface';
import { UsuarioService } from '../../usuarios/services/usuario-service';

@Injectable()
export class RegistrarEmailTelefoneSenhaService {
  constructor(
    private usuarioService: UsuarioService,
    private usuarioRepository: UsuarioRepository,
    private sessionRepository: SessionRepository,
    private jwtService: JwtService,
  ) {}

  async execute(data: UsuarioInterface) {
    await this.validarRegistro(data);
    const senhaHash = await bcrypt.hash(data.senhaHash ?? '', 8);
    await this.usuarioRepository.create({ ...data, senhaHash });
  }

  private async validarRegistro(data: UsuarioInterface) {
    const {
      nomeCompleto,
      nomeUsuario,
      email,
      telefone,
      senhaHash: Senha,
    } = data;

    if (isEmpty(nomeCompleto))
      throw new BadRequestException('nome_completo: Campo obrigatório');

    if (isEmpty(nomeUsuario))
      throw new BadRequestException('nome_usuario: Campo obrigatório');

    if (isEmpty(email))
      throw new BadRequestException('email: Campo obrigatório');

    if (isEmpty(telefone))
      throw new BadRequestException('telefone: Campo obrigatório');

    if (!isEmail(email)) throw new BadRequestException('Email inválido');

    if (isEmpty(Senha))
      throw new BadRequestException('senha: Campo obrigatório');

    if (!isValidNomeUsuario(nomeUsuario))
      throw new BadRequestException(
        'Nome de usuário inválido. (aceita apenas letras[a-z, A-Z], números[0-9], sublinhados (_) e traços (-))',
      );

    const emailExiste = await this.usuarioRepository.getByEmail(email);
    if (emailExiste) throw new BadRequestException('Email já cadastrado');

    const telefoneExiste = await this.usuarioRepository.getByTelefone(telefone);
    if (telefoneExiste) throw new BadRequestException('Telefone já cadastrado');

    const usuarioNomeExiste = await this.usuarioRepository.getByNomeUsuario(
      nomeUsuario,
    );

    if (usuarioNomeExiste)
      throw new BadRequestException('Nome de usuário já cadastrado');

    return data;
  }
}
