import { Injectable } from '@nestjs/common';
import { Prisma, AutenticacaoProvider } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AutenticacaoProviderRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    data: Prisma.AutenticacaoProviderCreateInput,
  ): Promise<AutenticacaoProvider> {
    return this.prisma.autenticacaoProvider.create({
      data,
    });
  }

  async getByUsuarioId(provider: string, usuarioId: string) {
    return this.prisma.autenticacaoProvider.findFirst({
      where: {
        provider,
        usuarioId,
      },
    });
  }

  async getByUsuarioProviderId(provider: string, usuarioProviderId: string) {
    return this.prisma.autenticacaoProvider.findFirst({
      where: {
        provider,
        usuarioProviderId,
      },
    });
  }

  async getByEmailId(provider: string, email: string) {
    return this.prisma.autenticacaoProvider.findFirst({
      where: {
        provider,
        email,
      },
    });
  }
}
