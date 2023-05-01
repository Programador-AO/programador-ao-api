import { Injectable } from '@nestjs/common';
import { UsuarioRepository } from '../../../database/prisma/repositories/usuario-repository';
import { UsuarioInterface } from '../interfaces/usuario-interface';

@Injectable()
export class UsuarioService {
  constructor(private usuarioRepository: UsuarioRepository) {}

  async create(data: UsuarioInterface) {
    // const { nomeCompleto, nomeUsuario, email, telefone, senhaHash, avatar } =
    //   data;
    // if (!nomeCompleto) throw new Error('Nome completo é obrigatário');
    // const telefoneExiste = await this.getByTelefone(telefone);
    // if (telefoneExiste) throw new Error('Telefone já cadastrado');
    // const emailExiste = await this.getByEmail(email);
    // if (emailExiste) throw new Error('Email já cadastrado');
    // const nomeUsuarioExiste = await this.getByNomeUsuario(nomeUsuario);
    // if (nomeUsuarioExiste) throw new Error('Nome de usuário já cadastrado');
    // const usuario = await this.usuarioRepository.create({
    //   ...data,
    //   nomeCompleto,
    //   nomeUsuario,
    //   email,
    //   telefone,
    //   senhaHash,
    //   avatar,
    // });
    // if (!usuario) throw new Error('Erro ao cadastrar usuário');
    // return { usuario };
  }

  async update(id: string, data: UsuarioInterface) {
    const { nomeCompleto, nomeUsuario, email, telefone } = data;

    if (!nomeCompleto) throw new Error('Nome completo é obrigatário');

    const telefoneExiste = await this.getByTelefone(telefone);
    if (telefoneExiste) throw new Error('Telefone já cadastrado');

    const emailExiste = await this.getByEmail(email);
    if (emailExiste) throw new Error('Email já cadastrado');

    const nomeUsuarioExiste = await this.getByNomeUsuario(nomeUsuario);
    if (nomeUsuarioExiste) throw new Error('Nome de usuário já cadastrado');

    const usuario = await this.usuarioRepository.update(id, data);

    if (!usuario) throw new Error('Erro ao alterar dados do usuário');

    return { usuario };
  }

  async delete(id: string): Promise<UsuarioInterface> {
    throw new Error('Method not implemented.');
  }

  async getAll() {
    const usuarios = await this.usuarioRepository.getAll();

    return { usuarios };
  }

  async getById(id: string) {
    const usuario = await this.usuarioRepository.getById(id);

    return { usuario };
  }

  async getByNomeUsuario(nomeUsuario: string) {
    const usuario = await this.usuarioRepository.getByNomeUsuario(nomeUsuario);

    return { usuario };
  }

  async getByEmail(email: string) {
    const usuario = await this.usuarioRepository.getByEmail(email);

    return { usuario };
  }

  async getByTelefone(telefone: string) {
    const usuario = await this.usuarioRepository.getByTelefone(telefone);

    return { usuario };
  }
}
