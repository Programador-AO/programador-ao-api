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
import { AlterarDadosAutenticacaoService } from '../services/alterar-dados-autenticacao-service';
import { RegistrarEmailTelefoneSenhaService } from '../services/registrar-email-telefone-senha-service';

import { RequestCustom } from '../../../helpers/request-custom';
import { AlterarDadosAutenticacaoDto } from './dtos/alterar-dados-autenticacao-dto';
import { toCamelCase } from '../../../helpers/convert-property-case';

@Controller('auth')
export class AuthController {
  constructor(
    private loginSenhaService: LoginSenhaService,
    private registrarEmailTelefoneSenhaService: RegistrarEmailTelefoneSenhaService,
    private alterarSenhaService: AlterarSenhaService,
    private alterarDadosAutenticacaoService: AlterarDadosAutenticacaoService,
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
    const {
      id = '',
      senha_antiga,
      senha_nova,
    } = { id: req.usuario?.id, ...input };

    try {
      return this.alterarSenhaService.execute(id, senha_antiga, senha_nova);
    } catch (error) {
      throw new HttpException('Erro ao registrar', HttpStatus.BAD_REQUEST);
    }
  }

  @Post('alterar-dados')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  alterarDados(
    @Req() req: RequestCustom,
    @Body() input: AlterarDadosAutenticacaoDto,
  ) {
    try {
      const id = req.usuario?.id ?? '';
      return this.alterarDadosAutenticacaoService.execute(id, {
        nomeCompleto: input.nome_completo,
        nomeUsuario: input.nome_usuario,
        email: input.email,
        telefone: input.telefone,
      });
    } catch (error) {
      throw new HttpException('Erro ao registrar', HttpStatus.BAD_REQUEST);
    }
  }
}
