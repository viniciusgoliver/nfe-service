import { ApiProperty } from '@nestjs/swagger';

export class InvoiceEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  clientId: string;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  xml: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  items: {
    productId: string;
    quantity: number;
  }[];
}
