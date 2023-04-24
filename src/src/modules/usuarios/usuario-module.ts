import { Module } from '@nestjs/common';
import { UsuarioController } from './controllers/usuario-controler';
import { UsuarioService } from './services/usuario-service';

@Module({
  providers: [UsuarioService],
  exports: [UsuarioService],
  controllers: [UsuarioController],
})
export class UsuarioModule {}
