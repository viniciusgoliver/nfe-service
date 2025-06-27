import { ApiProperty } from '@nestjs/swagger';

export class AuthConfirmEmailDTO {
  id: string;

  @ApiProperty()
  confirmationToken: string;
}
