import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  HttpException,
} from '@nestjs/common';
import { Public } from '../guards/routes-visibility';
import { AuthService } from '../services/auth-service';
import { LoginSenhaDto } from './dtos/login-senha-dto';
import { RegisterEmailSenhaDto } from './dtos/register-email-senha-dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('logar')
  @HttpCode(HttpStatus.OK)
  loginSenha(@Body() input: LoginSenhaDto) {
    try {
      return this.authService.loginSenha(input.login, input.senha);
    } catch (error) {
      throw new HttpException('Erro ao logar', HttpStatus.BAD_REQUEST);
    }
  }

  @Public()
  @Post('registrar')
  @HttpCode(HttpStatus.OK)
  registerEmailTelefoneSenha(@Body() input: RegisterEmailSenhaDto) {
    try {
      return this.authService.registerEmailTelefoneSenha({
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
}
