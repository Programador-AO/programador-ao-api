import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { isEmpty } from 'class-validator';

import { SessionRepository } from '../../../database/prisma/repositories/session-repository';
import { UsuarioRepository } from '../../../database/prisma/repositories/usuario-repository';

import { UsuarioService } from '../../usuarios/services/usuario-service';

@Injectable()
export class AlterarSenhaService {
  constructor(
    private usuarioService: UsuarioService,
    private usuarioRepository: UsuarioRepository,
    private sessionRepository: SessionRepository,
    private jwtService: JwtService,
  ) {}

  async execute(senhaAntiga: string, senhaNova: string): Promise<void> {
    return;
  }
}
