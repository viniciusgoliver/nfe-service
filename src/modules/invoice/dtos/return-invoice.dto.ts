import { ApiProperty } from '@nestjs/swagger'
import { InvoiceDataDTO } from './invoice-data.dto'

export class InvoiceReturnDTO {
  @ApiProperty({ type: InvoiceDataDTO })
  invoice: InvoiceDataDTO

  @ApiProperty()
  message: string
}
