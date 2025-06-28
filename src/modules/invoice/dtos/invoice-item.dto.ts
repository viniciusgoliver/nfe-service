import { ApiProperty } from '@nestjs/swagger';
import { ProductDTO } from './invoice-produto.dto';

export class InvoiceItemDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  invoiceId: string;

  @ApiProperty()
  productId: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  total: number;

  @ApiProperty({ type: ProductDTO })
  product: ProductDTO;
}
