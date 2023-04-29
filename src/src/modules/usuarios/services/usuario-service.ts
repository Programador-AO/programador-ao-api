import { Injectable } from '@nestjs/common';
import { UsuarioRepository } from '../../../database/prisma/repositories/usuario-repository';
import { UsuarioInterface } from '../interfaces/usuario-interface';

@Injectable()
export class UsuarioService {
  constructor(private usuarioRepository: UsuarioRepository) {}

  async create(data: UsuarioInterface): Promise<void> {
    const { nomeCompleto, nomeUsuario, email, telefone, senhaHash, avatar } =
      data;

    if (!nomeCompleto) throw new Error('Nome completo é obrigatário');

    const telefoneExiste = await this.getByTelefone(telefone);
    if (telefoneExiste) throw new Error('Telefone já cadastrado');

    const emailExiste = await this.getByEmail(email);
    if (emailExiste) throw new Error('Email já cadastrado');

    const nomeUsuarioExiste = await this.getByNomeUsuario(nomeUsuario);
    if (nomeUsuarioExiste) throw new Error('Nome de usuário já cadastrado');

    const result = await this.usuarioRepository.create({
      ...data,
      nomeCompleto,
      nomeUsuario,
      email,
      telefone,
      senhaHash,
      avatar,
    });

    if (!result) throw new Error('Erro ao cadastrar usuário');
  }

  async update(id: string, data: UsuarioInterface): Promise<void> {
    const { nomeCompleto, nomeUsuario, email, telefone, senhaHash, avatar } =
      data;

    if (!nomeCompleto) throw new Error('Nome completo é obrigatário');

    const telefoneExiste = await this.getByTelefone(telefone);
    if (telefoneExiste) throw new Error('Telefone já cadastrado');

    const emailExiste = await this.getByEmail(email);
    if (emailExiste) throw new Error('Email já cadastrado');

    const nomeUsuarioExiste = await this.getByNomeUsuario(nomeUsuario);
    if (nomeUsuarioExiste) throw new Error('Nome de usuário já cadastrado');

    // const result = await this.usuarioRepository.update({
    //   ...data,
    //   nomeCompleto,
    //   nomeUsuario,
    //   email,
    //   telefone,
    //   senhaHash,
    //   avatar,
    // });

    // if (!result) throw new Error('Erro ao cadastrar usuário');
    // throw new Error('Method not implemented.');
  }

  async delete(id: string): Promise<UsuarioInterface> {
    throw new Error('Method not implemented.');
  }

  async getAll(): Promise<UsuarioInterface[]> {
    const usuarios = await this.usuarioRepository.getAll();
    return usuarios.map((usuario) => ({
      ...usuario,
      senhaHash: undefined,
    }));
  }

  async getById(id: string): Promise<UsuarioInterface | null> {
    const usuario = await this.usuarioRepository.getById(id);
    if (!usuario) return null;
    return { ...usuario, senhaHash: undefined };
  }

  async getByNomeUsuario(
    nomeUsuario: string,
  ): Promise<UsuarioInterface | null> {
    const usuario = await this.usuarioRepository.getByNomeUsuario(nomeUsuario);
    if (!usuario) return null;

    return { ...usuario, senhaHash: undefined };
  }

  async getByEmail(email: string): Promise<UsuarioInterface> {
    const usuario = await this.usuarioRepository.getByEmail(email);
    if (!usuario) return null;
    return { ...usuario, senhaHash: undefined };
  }

  async getByTelefone(telefone: string): Promise<UsuarioInterface> {
    const usuario = await this.usuarioRepository.getByTelefone(telefone);
    if (!usuario) return null;
    return { ...usuario, senhaHash: undefined };
  }
}
