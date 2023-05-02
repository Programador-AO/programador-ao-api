import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class RegisterEmailSenhaDto {
  @ApiProperty()
  @IsNotEmpty()
  nome_completo: string;

  @ApiProperty()
  @IsNotEmpty()
  nome_usuario: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  telefone: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(8)
  senha: string;
}
