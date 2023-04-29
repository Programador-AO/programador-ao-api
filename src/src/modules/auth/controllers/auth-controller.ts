import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  HttpException,
  UseGuards,
} from '@nestjs/common';

import { Public } from '../guards/routes-visibility';
import { AuthGuard } from '../../auth/guards/auth-guard';

import { LoginSenhaDto } from './dtos/login-senha-dto';
import { AlterarSenhaDto } from './dtos/alterar-senha-dto';
import { RegisterEmailSenhaDto } from './dtos/register-email-senha-dto';

import { LoginSenhaService } from '../services/login-senha-service';
import { AlterarSenhaService } from '../services/alterar-senha-service';
import { RegistrarEmailTelefoneSenhaService } from '../services/registrar-email-telefone-senha-service';
import { RequestCustom } from '../../usuarios/interfaces/usuario-interface';

@Controller('auth')
export class AuthController {
  constructor(
    private loginSenhaService: LoginSenhaService,
    private registrarEmailTelefoneSenhaService: RegistrarEmailTelefoneSenhaService,
    private alterarSenhaService: AlterarSenhaService,
  ) {}

  @Public()
  @Post('logar')
  @HttpCode(HttpStatus.OK)
  loginSenha(@Body() input: LoginSenhaDto) {
    try {
      return this.loginSenhaService.execute(input.login, input.senha);
    } catch (error) {
      throw new HttpException('Erro ao logar', HttpStatus.BAD_REQUEST);
    }
  }

  @Public()
  @Post('registrar')
  @HttpCode(HttpStatus.OK)
  registerEmailTelefoneSenha(@Body() input: RegisterEmailSenhaDto) {
    try {
      return this.registrarEmailTelefoneSenhaService.execute({
        nomeCompleto: input.nome_completo,
        nomeUsuario: input.nome_usuario,
        email: input.email,
        telefone: input.telefone,
        senhaHash: input.senha,
      });
    } catch (error) {
      throw new HttpException('Erro ao registrar', HttpStatus.BAD_REQUEST);
    }
  }

  @Post('alterar-senha')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  alterarSenha(@Req() req: RequestCustom, @Body() input: AlterarSenhaDto) {
    const { id } = req.usuario;
    const { senha_antiga, senha_nova } = input;

    try {
      return this.alterarSenhaService.execute(id, senha_antiga, senha_nova);
    } catch (error) {
      throw new HttpException('Erro ao registrar', HttpStatus.BAD_REQUEST);
    }
  }
}
