import { Injectable } from '@nestjs/common';
import { Prisma, Sessao } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SessionRepository {
  constructor(private prisma: PrismaService) {}

  async create() {
    return '';
  }

  async delete(id: string) {
    return id;
  }

  async getByUsuarioId(usuarioId: string) {
    return this.prisma.sessao.findFirst({
      where: {
        usuarioId,
      },
    });
  }
}
