import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../auth/guards/auth-guard';
import { UsuarioService } from '../services/usuario-service';

@Controller('usuarios')
export class UsuarioController {
  constructor(private usuarioService: UsuarioService) {}

  @UseGuards(AuthGuard)
  @Get('perfil')
  async getProfile(@Request() req) {
    const { id } = req.usuario;
    const usuario = await this.usuarioService.getById(id);

    return usuario;
  }

  @UseGuards(AuthGuard)
  // @Get('')
  async getAllUsuarios(@Request() req) {
    const usuarios = await this.usuarioService.getAll();

    return usuarios;
  }
}
