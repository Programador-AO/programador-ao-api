import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class AlterarDadosAutenticacaoDto {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  nome_completo: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(4)
  nome_usuario: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  telefone: string;
}
