import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard as AuthGuardPassport } from '@nestjs/passport';
import { ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';

import { AuthGuard } from '../guards/auth.guard';
import { Public } from '../guards/routes-visibility';

import { AlterarDadosAutenticacaoDto } from './dtos/alterar-dados-autenticacao-dto';
import { AlterarSenhaDto } from './dtos/alterar-senha-dto';
import { EsqueciMinhaSenhaDto } from './dtos/esqueci-minha-senha-dto';
import { LoginSenhaDto } from './dtos/login-senha-dto';
import { RedefinirMinhaSenhaDto } from './dtos/redefinir-minha-senha-dto';
import { RegisterEmailSenhaDto } from './dtos/register-email-senha-dto';
import { VerificarEmailDto } from './dtos/verificar-email-dto';

import { AlterarDadosAutenticacaoService } from '../services/alterar-dados-autenticacao.service';
import { AlterarSenhaService } from '../services/alterar-senha.service';
import { EsqueciMinhaSenhaService } from '../services/esqueci-minha-senha.service';
import { LoginProviderService } from '../services/login-provider.service';
import { LoginSenhaService } from '../services/login-senha.service';
import { RecuperarMinhaSenhaService } from '../services/recuperar-minha-senha.service';
import { RedefinirSenhaService } from '../services/redefinir-senha.service';
import { RegistrarEmailTelefoneSenhaService } from '../services/registrar-email-telefone-senha.service';
import { VerificacaoEmailService } from '../services/verificacao-email.service';

import { RequestCustom } from '../../../helpers/request-custom';
import { GithubStrategy } from '../strategies/github-strategy';

import appConfig from '../../../config/app.config';
import authConfig from '../../../config/auth.config';

const { websiteDomain } = appConfig();
const { authCallbackUrlWebsite } = authConfig();

@Controller('auth')
export class AuthController {
  constructor(
    private loginSenhaService: LoginSenhaService,
    private loginProviderService: LoginProviderService,
    private registrarEmailTelefoneSenhaService: RegistrarEmailTelefoneSenhaService,
    private alterarSenhaService: AlterarSenhaService,
    private alterarDadosAutenticacaoService: AlterarDadosAutenticacaoService,
    private verificacaoEmailService: VerificacaoEmailService,
    private esqueciMinhaSenhaService: EsqueciMinhaSenhaService,
    private recuperarMinhaSenhaService: RecuperarMinhaSenhaService,
    private redefinirSenhaService: RedefinirSenhaService,
    private githubStrategy: GithubStrategy,
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

  @Post('esqueci-minha-senha')
  @HttpCode(HttpStatus.OK)
  @Public()
  async esqueciMinhaSenha(@Body() { email }: EsqueciMinhaSenhaDto) {
    try {
      await this.esqueciMinhaSenhaService.execute(email);

      return {
        message:
          'Um email de recuperação de senha foi enviado para o endereço fornecido. Por favor, verifique sua caixa de entrada e siga as instruções para redefinir sua senha.',
      };
    } catch (error) {
      throw new HttpException(
        'Erro ao solicitar recuperação de senha',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('recuperar-minha-senha')
  @HttpCode(HttpStatus.OK)
  @Public()
  @ApiQuery({ name: 'token', type: String })
  async recuperarSenha(@Query('token') token: string) {
    try {
      const { codigo } = await this.recuperarMinhaSenhaService.execute(token);

      return {
        message: 'Código para redefinição de senha',
        codigo,
      };
    } catch (e) {
      throw new HttpException(
        'Erro ao recuperar a senha',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('redefinir-minha-senha')
  @HttpCode(HttpStatus.OK)
  @Public()
  async redefinirMinhaSenha(@Body() input: RedefinirMinhaSenhaDto) {
    const { email, codigo, nova_senha } = input;

    try {
      await this.redefinirSenhaService.execute(email, codigo, nova_senha);

      return { message: 'Senha atualizada com sucesso.' };
    } catch (e) {
      throw new HttpException(
        'Erro ao redefinir a senha',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('google')
  @Public()
  @UseGuards(AuthGuardPassport('google'))
  async googleAuth() {
    return;
  }

  @Get('google/callback')
  @Public()
  @UseGuards(AuthGuardPassport('google'))
  async googleAuthRedirect(@Req() req) {
    try {
      return await this.loginProviderService.execute(req.user.usuarioId);

      // return res.redirect(
      //   `${websiteDomain}${authCallbackUrlWebsite}?access=${JSON.stringify(
      //     result,
      //   )}`,
      // );
    } catch (error) {
      throw new HttpException('Erro ao logar', HttpStatus.BAD_REQUEST);
    }
  }

  @Get('github')
  @Public()
  @UseGuards(AuthGuardPassport('github'))
  async githubAuth() {
    return;
  }

  @Get('github/callback')
  @Public()
  @UseGuards(AuthGuardPassport('github'))
  async githubAuthRedirect(@Req() req, @Res() res: Response) {
    try {
      return await this.loginProviderService.execute(req.user.usuarioId);

      // return res.redirect(
      //   `${websiteDomain}${authCallbackUrlWebsite}?access=${JSON.stringify(
      //     result,
      //   )}`,
      // );
    } catch (error) {
      throw new HttpException('Erro ao logar', HttpStatus.BAD_REQUEST);
    }
  }
}
