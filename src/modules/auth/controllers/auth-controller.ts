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
import { VerificarEmailDto } from './dtos/verificar-email-dto';
import { RegisterEmailSenhaDto } from './dtos/register-email-senha-dto';
import { AlterarDadosAutenticacaoDto } from './dtos/alterar-dados-autenticacao-dto';

import { LoginSenhaService } from '../services/login-senha-service';
import { AlterarSenhaService } from '../services/alterar-senha-service';
import { VerificacaoEmailService } from '../services/verificacao-email-service';
import { AlterarDadosAutenticacaoService } from '../services/alterar-dados-autenticacao-service';
import { RegistrarEmailTelefoneSenhaService } from '../services/registrar-email-telefone-senha-service';

import { RequestCustom } from '../../../helpers/request-custom';

@Controller('auth')
export class AuthController {
  constructor(
    private loginSenhaService: LoginSenhaService,
    private registrarEmailTelefoneSenhaService: RegistrarEmailTelefoneSenhaService,
    private alterarSenhaService: AlterarSenhaService,
    private alterarDadosAutenticacaoService: AlterarDadosAutenticacaoService,
    private verificacaoEmailService: VerificacaoEmailService,
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
  async registerEmailTelefoneSenha(@Body() input: RegisterEmailSenhaDto) {
    try {
      await this.registrarEmailTelefoneSenhaService.execute({
        nomeCompleto: input.nome_completo,
        nomeUsuario: input.nome_usuario,
        email: input.email,
        telefone: input.telefone,
        senhaHash: input.senha,
      });

      return { message: 'Registrado com sucesso!' };
    } catch (error) {
      throw new HttpException('Erro ao registrar', HttpStatus.BAD_REQUEST);
    }
  }

  @Post('alterar-senha')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async alterarSenha(
    @Req() req: RequestCustom,
    @Body() input: AlterarSenhaDto,
  ) {
    const {
      id = '',
      senha_antiga,
      senha_nova,
    } = { id: req.usuario?.id, ...input };

    try {
      await this.alterarSenhaService.execute(id, senha_antiga, senha_nova);

      return { message: 'Senha alterada com sucesso!' };
    } catch (error) {
      throw new HttpException('Erro ao alterar senha', HttpStatus.BAD_REQUEST);
    }
  }

  @Post('alterar-dados')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async alterarDados(
    @Req() req: RequestCustom,
    @Body() input: AlterarDadosAutenticacaoDto,
  ) {
    try {
      const id = req.usuario?.id ?? '';
      await this.alterarDadosAutenticacaoService.execute(id, {
        nomeCompleto: input.nome_completo,
        nomeUsuario: input.nome_usuario,
        email: input.email,
        telefone: input.telefone,
      });

      return { message: 'Dados alterados com sucesso!' };
    } catch (error) {
      throw new HttpException('Erro ao alterar dados', HttpStatus.BAD_REQUEST);
    }
  }

  @Post('solicitar-verificacao-email')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async solicitacaoVerificacaoEmail(@Req() req: RequestCustom) {
    try {
      await this.verificacaoEmailService.solicitar(req.usuario?.id ?? '');

      return { message: 'Email enviado com sucesso!' };
    } catch (error) {
      throw new HttpException(
        'Erro ao solicitar verificação de email',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('verificar-email')
  @HttpCode(HttpStatus.OK)
  @Public()
  async verificacaoEmail(
    @Req() req: RequestCustom,
    @Body() input: VerificarEmailDto,
  ) {
    try {
      await this.verificacaoEmailService.verificar(input.token);

      return { message: 'Email verificado com sucesso!' };
    } catch (error) {
      throw new HttpException(
        'Erro ao verificar email',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
