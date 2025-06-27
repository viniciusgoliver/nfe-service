import {
  IsNotEmpty,
  IsUUID,
  IsInt,
  Min,  
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InvoiceItemDTO {
  @IsNotEmpty({
    message: 'Informe o ID do produto',
  })
  @IsUUID()
  @ApiProperty()
  productId: string;

  @IsNotEmpty({
    message: 'Informe a quantidade do produto',
  })
  @IsInt()
  @Min(1)
  @ApiProperty()
  quantity: number;
}
