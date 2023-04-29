import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../auth/guards/auth-guard';
import { UsuarioService } from '../services/usuario-service';
import { RequestCustom } from '../interfaces/usuario-interface';

@Controller('usuarios')
export class UsuarioController {
  constructor(private usuarioService: UsuarioService) {}

  @UseGuards(AuthGuard)
  @Get('perfil')
  async getProfile(@Req() req: RequestCustom) {
    const { id } = req.usuario;
    const usuario = await this.usuarioService.getById(id);

    return usuario;
  }

  @UseGuards(AuthGuard)
  async getAllUsuarios() {
    const usuarios = await this.usuarioService.getAll();

    return usuarios;
  }
}
