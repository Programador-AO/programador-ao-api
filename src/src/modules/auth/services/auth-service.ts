import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { isEmpty, isEmail, isPhoneNumber } from 'class-validator';

import { UsuarioService } from '../../usuarios/services/usuario-service';
import { UsuarioInterface } from '../../usuarios/interfaces/usuario-interface';
import { LoginEmailPasswordResponseInterface } from '../interfaces/auth-interface';
import { UsuarioRepository } from '../../../database/prisma/repositories/usuario-reposytory';
import { SessionRepository } from '../../../database/prisma/repositories/session-repository';
import { isValidNomeUsuario } from '../../../helpers/regex';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuarioService,
    private usuarioRepository: UsuarioRepository,
    private sessionRepository: SessionRepository,
    private jwtService: JwtService,
  ) {}

  async loginSenha(
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

    const senhaValida = await bcrypt.compare(senha, usuario.senhaHash);
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

  async registerEmailTelefoneSenha(data: UsuarioInterface): Promise<void> {
    await this.validarRegistro(data);

    const senhaHash = await bcrypt.hash(data.senhaHash, 8);
    await this.usuarioService.create({ ...data, senhaHash });
  }

  async validarRegistro(data: UsuarioInterface) {
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

    return true;
  }
}
