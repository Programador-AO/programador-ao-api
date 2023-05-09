import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RedefinirMinhaSenhaDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  codigo: string;

  @ApiProperty()
  @IsNotEmpty()
  nova_senha: string;
}
