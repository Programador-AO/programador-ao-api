import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginSenhaDto {
  @ApiProperty({
    description: 'email, telefone ou Nome do Usuário',
    example: 'qualquer@programador.ao',
    format: 'email | phone | name',
  })
  @IsNotEmpty()
  login: string;

  @ApiProperty()
  @IsNotEmpty()
  senha: string;
}
