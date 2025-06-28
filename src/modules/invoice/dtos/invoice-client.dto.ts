import { ApiProperty } from '@nestjs/swagger';

export class ClientDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  cnpj: string;

  @ApiProperty()
  ie: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}