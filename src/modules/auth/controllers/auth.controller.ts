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
import { ApiQuery } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthGuard as AuthGuardPassport } from '@nestjs/passport';

import { AuthGuard } from '../guards/auth.guard';
import { Public } from '../guards/routes-visibility';

import { LoginSenhaDto } from './dtos/login-senha-dto';
import { AlterarSenhaDto } from './dtos/alterar-senha-dto';
import { VerificarEmailDto } from './dtos/verificar-email-dto';
import { EsqueciMinhaSenhaDto } from './dtos/esqueci-minha-senha-dto';
import { RegisterEmailSenhaDto } from './dtos/register-email-senha-dto';
import { RedefinirMinhaSenhaDto } from './dtos/redefinir-minha-senha-dto';
import { AlterarDadosAutenticacaoDto } from './dtos/alterar-dados-autenticacao-dto';

import { LoginSenhaService } from '../services/login-senha.service';
import { AlterarSenhaService } from '../services/alterar-senha.service';
import { RedefinirSenhaService } from '../services/redefinir-senha.service';
import { VerificacaoEmailService } from '../services/verificacao-email.service';
import { EsqueciMinhaSenhaService } from '../services/esqueci-minha-senha.service';
import { RecuperarMinhaSenhaService } from '../services/recuperar-minha-senha.service';
import { AlterarDadosAutenticacaoService } from '../services/alterar-dados-autenticacao.service';
import { RegistrarEmailTelefoneSenhaService } from '../services/registrar-email-telefone-senha.service';

import { RequestCustom } from '../../../helpers/request-custom';
import { GithubStrategy } from '../strategies/github-strategy';

import { FirebaseAuthGuard } from '@whitecloak/nestjs-passport-firebase';

import { getAuth, signInWithRedirect, GithubAuthProvider } from 'firebase/auth';
import { FirebaseService } from '../services/firebase.service';
@Controller('auth')
export class AuthController {
  constructor(
    private loginSenhaService: LoginSenhaService,
    private registrarEmailTelefoneSenhaService: RegistrarEmailTelefoneSenhaService,
    private alterarSenhaService: AlterarSenhaService,
    private alterarDadosAutenticacaoService: AlterarDadosAutenticacaoService,
    private verificacaoEmailService: VerificacaoEmailService,
    private esqueciMinhaSenhaService: EsqueciMinhaSenhaService,
    private recuperarMinhaSenhaService: RecuperarMinhaSenhaService,
    private redefinirSenhaService: RedefinirSenhaService,
    private githubStrategy: GithubStrategy,
    private firebaseService: FirebaseService,
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
    return {
      message: 'Google authentication successful!',
      user: req.user,
    };
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
  async githubAuthRedirect(@Req() req, @Res() res) {
    console.log(req.user.usuarioId);

    res.redirect(`https://example.com/?token=`);
  }

  @Get('firebase')
  @Public()
  firebaseAuth() {
    const provider = new GithubAuthProvider();
    const auth = getAuth(this.firebaseService.initApp());
    signInWithRedirect(auth, provider);

    return signInWithRedirect(auth, provider);
  }
}
