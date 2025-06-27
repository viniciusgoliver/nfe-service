import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AuthSendConfirmationEmailDTO {
  @IsNotEmpty({
    message: 'Informe um endereço de email',
  })
  @ApiProperty()
  email: string;

  @IsNotEmpty({
    message: 'Informe tokenConfirmarion',
  })
  @ApiProperty()
  confirmationToken: string;
}
