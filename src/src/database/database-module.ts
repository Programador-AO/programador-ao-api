import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UsuarioRepository } from './prisma/repositories/usuario-reposytory';
import { SessionRepository } from './prisma/repositories/session-repository';

@Global()
@Module({
  providers: [PrismaService, UsuarioRepository, SessionRepository],
  exports: [PrismaService, UsuarioRepository, SessionRepository],
})
export class DatabaseModule {}
