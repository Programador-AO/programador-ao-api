import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Public } from '../guards/routes-visibility';
import { AuthService } from '../services/auth-service';
import { LoginEmailSenhaDto } from './dtos/login-email-senha-dto';
import { RegisterEmailSenhaDto } from './dtos/register-email-senha-dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  loginEmailSenha(@Body() input: LoginEmailSenhaDto) {
    try {
      return this.authService.loginEmailPassword(input.email, input.senha);
    } catch (error) {
      console.log(error);
    }
  }

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.OK)
  registerEmailSenha(@Body() input: RegisterEmailSenhaDto) {
    try {
      return this.authService.registerEmailSenha({
        nomeCompleto: input.nome_completo,
        nomeUsuario: input.nome_usuario,
        email: input.email,
        telefone: input.telefone,
        senhaHash: input.senha,
      });
    } catch (error) {
      console.log(error);
    }
  }
}
