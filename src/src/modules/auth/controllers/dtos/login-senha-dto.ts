import { ApiProperty } from '@nestjs/swagger';

export class LoginSenhaDto {
  @ApiProperty({
    description: 'email, telefone ou Nome do Usuário',
    example: 'qualquer@programador.ao',
    format: 'email | phone | name',
  })
  login: string;

  @ApiProperty()
  senha: string;
}
