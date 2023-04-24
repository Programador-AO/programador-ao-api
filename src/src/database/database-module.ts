import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UsuarioRepository } from './prisma/repositories/usuario-reposytory';

@Global()
@Module({
  providers: [PrismaService, UsuarioRepository],
  exports: [PrismaService, UsuarioRepository],
})
export class DatabaseModule {}
