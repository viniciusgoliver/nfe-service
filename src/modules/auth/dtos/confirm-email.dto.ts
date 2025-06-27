import { ApiProperty } from '@nestjs/swagger';

export class ConfirmEmailDTO {
  id: string;

  @ApiProperty()
  confirmationToken: string;
}
