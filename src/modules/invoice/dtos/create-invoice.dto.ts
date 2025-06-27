import {
  IsNotEmpty,
  IsUUID,
  IsInt,
  Min,
  ArrayNotEmpty,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class InvoiceItemDTO {
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
export class CreateInvoiceDTO {
  @IsOptional()
  @IsUUID()
  @ApiProperty()
  id?: string;

  @IsNotEmpty({
    message: 'Informe o ID do cliente',
  })
  @IsUUID()
  @ApiProperty()
  clientId: string;

  @IsNotEmpty({
    message: 'Informe o ID do usuário',
  })
  @IsInt()
  @ApiProperty()
  userId: number;

  @IsNotEmpty({
    message: 'Informe os itens da fatura',
  })
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => InvoiceItemDTO)
  @ApiProperty()
  items: InvoiceItemDTO[];
}
