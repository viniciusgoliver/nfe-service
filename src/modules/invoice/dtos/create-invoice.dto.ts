import {
  IsNotEmpty,
  IsUUID,
  IsInt,
  ArrayNotEmpty,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiExtraModels } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { InvoiceItemDTO } from './invoice-item.dto';

@ApiExtraModels(InvoiceItemDTO)
export class InvoiceCreateInvoiceDTO {
  @IsOptional()
  @IsUUID()
  @ApiProperty()
  id?: string;

  @IsNotEmpty({ message: 'Informe o ID do cliente' })
  @IsUUID()
  @ApiProperty()
  clientId: string;

  @IsNotEmpty({ message: 'Informe o ID do usuário' })
  @IsInt()
  @ApiProperty()
  userId: number;

  @IsNotEmpty({ message: 'Informe os itens da fatura' })
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => InvoiceItemDTO)
  @ApiProperty({ type: [InvoiceItemDTO] })
  items: InvoiceItemDTO[];
}