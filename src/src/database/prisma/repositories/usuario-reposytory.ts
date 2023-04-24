import { Injectable } from '@nestjs/common';
import { Prisma, Usuario } from '@prisma/client';

import { PrismaService } from '../prisma.service';

@Injectable()
export class UsuarioRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UsuarioCreateInput): Promise<Usuario> {
    return this.prisma.usuario.create({
      data,
    });
  }

  async update(id: string, data: Prisma.UsuarioUpdateInput): Promise<Usuario> {
    return this.prisma.usuario.update({
      data,
      where: { id },
    });
  }

  async delete(id: string): Promise<Usuario> {
    return this.prisma.usuario.delete({
      where: { id },
    });
  }

  async getAll(): Promise<Usuario[]> {
    return this.prisma.usuario.findMany();
  }

  async getById(id: string): Promise<Usuario | null> {
    return this.prisma.usuario.findUnique({
      where: {
        id,
      },
    });
  }

  async getByNomeUsuario(nomeUsuario: string): Promise<Usuario | null> {
    return this.prisma.usuario.findUnique({
      where: {
        nomeUsuario,
      },
    });
  }

  async getByEmail(email: string): Promise<Usuario | null> {
    return this.prisma.usuario.findUnique({
      where: {
        email,
      },
    });
  }

  async getByTelefone(telefone: string): Promise<Usuario | null> {
    return this.prisma.usuario.findUnique({
      where: {
        telefone,
      },
    });
  }
}
