import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RecoverPasswordEmailDTO {
  @IsNotEmpty({
    message: 'Informe um endereço de email',
  })
  @ApiProperty()
  email: string;

  @IsNotEmpty({
    message: 'Informe recoverToken',
  })
  @ApiProperty()
  recoverToken: string;
}
