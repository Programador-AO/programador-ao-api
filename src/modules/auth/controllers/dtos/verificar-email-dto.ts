import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class VerificarEmailDto {
  @ApiProperty()
  @IsNotEmpty()
  token: string;
}
