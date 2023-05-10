import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { SessionRepository } from './prisma/repositories/session-repository';
import { UsuarioRepository } from './prisma/repositories/usuario-repository';
import { AutenticacaoProviderRepository } from './prisma/repositories/autenticacao-provider-repository';

@Global()
@Module({
  providers: [
    PrismaService,
    UsuarioRepository,
    SessionRepository,
    AutenticacaoProviderRepository,
  ],
  exports: [
    PrismaService,
    UsuarioRepository,
    SessionRepository,
    AutenticacaoProviderRepository,
  ],
})
export class DatabaseModule {}
