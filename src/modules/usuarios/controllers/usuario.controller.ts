import { Controller, Get, Req, UseGuards } from '@nestjs/common';

import { ControllerUsuarioMapper } from '../../../database/prisma/mappers/controller-usuario-mapper';
import { RequestCustom } from '../../../helpers/request-custom';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { UsuarioService } from '../services/usuario-service';

@Controller('usuarios')
export class UsuarioController {
  constructor(private usuarioService: UsuarioService) {}

  @UseGuards(AuthGuard)
  @Get('perfil')
  async getProfile(@Req() req: RequestCustom) {
    const id = req.usuario?.id ?? '';
    const { usuario } = await this.usuarioService.getById(id);

    return ControllerUsuarioMapper.toController(usuario);
  }

  @UseGuards(AuthGuard)
  @Get('/')
  async getAllUsuarios() {
    const { usuarios } = await this.usuarioService.getAll();

    return usuarios.map((usuario) =>
      ControllerUsuarioMapper.toController({ ...usuario }),
    );
  }
}
