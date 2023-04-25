import { ApiProperty } from '@nestjs/swagger';

export class RegisterEmailSenhaDto {
  @ApiProperty()
  nome_completo: string;

  @ApiProperty()
  nome_usuario: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  telefone: string;

  @ApiProperty()
  senha: string;
}
