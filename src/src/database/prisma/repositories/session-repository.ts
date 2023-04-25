import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SessionRepository {
  constructor(private prisma: PrismaService) {}

  //   async create(data: Prisma.UsuarioCreateInput): Promise<Usuario> {
  //     return this.prisma.usuario.create({
  //       data,
  //     });
  //   }
}
