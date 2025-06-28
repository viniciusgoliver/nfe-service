import { ApiProperty } from '@nestjs/swagger'
import { ClientDTO } from './invoice-client.dto'
import { InvoiceItemDTO } from './invoice-item.dto'

export class InvoiceDataDTO {
  @ApiProperty()
  id: string

  @ApiProperty()
  status: string

  @ApiProperty()
  clientId: string

  @ApiProperty()
  userId: number

  @ApiProperty({ nullable: true })
  xml: string | null

  @ApiProperty()
  createdAt: string

  @ApiProperty()
  updatedAt: string

  @ApiProperty({ type: ClientDTO })
  client: ClientDTO

  @ApiProperty({ type: [InvoiceItemDTO] })
  items: InvoiceItemDTO[]
}
