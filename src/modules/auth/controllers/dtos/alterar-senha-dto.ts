import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class AlterarSenhaDto {
  @ApiProperty()
  @IsNotEmpty()
  senha_antiga: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(8)
  senha_nova: string;
}
