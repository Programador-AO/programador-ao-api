import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { SessionRepository } from './prisma/repositories/session-repository';
import { UsuarioRepository } from './prisma/repositories/usuario-repository';

@Global()
@Module({
  providers: [PrismaService, UsuarioRepository, SessionRepository],
  exports: [PrismaService, UsuarioRepository, SessionRepository],
})
export class DatabaseModule {}
