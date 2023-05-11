import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';

import { ControllerUsuarioMapper } from '../../../database/prisma/mappers/controller-usuario-mapper';
import { RequestCustom } from '../../../helpers/request-custom';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { UsuarioService } from '../services/usuario-service';
import { Public } from '../../auth/guards/routes-visibility';
import { ApiQuery } from '@nestjs/swagger';

@Controller('usuarios')
export class UsuarioController {
  constructor(private usuarioService: UsuarioService) {}

  @Get('perfil')
  @UseGuards(AuthGuard)
  async getPerfil(@Req() req: RequestCustom) {
    const id = req.usuario?.id ?? '';
    const { usuario } = await this.usuarioService.getById(id);

    return ControllerUsuarioMapper.toController(usuario);
  }

  @Public()
  @Get('perfil/:nomeUsuario')
  @ApiQuery({ name: 'nomeUsuario', type: String })
  async getPerfilPublicoByUsername(@Param('nomeUsuario') nomeUsuario: string) {
    const { usuario } = await this.usuarioService.getByNomeUsuario(nomeUsuario);
    if (!usuario) throw new NotFoundException('Usuário não encontrado.');

    return ControllerUsuarioMapper.toController(usuario);
  }

  @Get('/')
  @UseGuards(AuthGuard)
  async getAllUsuarios() {
    const { usuarios } = await this.usuarioService.getAll();

    return usuarios.map((usuario) =>
      ControllerUsuarioMapper.toController({ ...usuario }),
    );
  }
}
