import { IsNotEmpty, IsInt, Min } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class InvoiceXmlDataDTO {
  @IsNotEmpty({
    message: 'Informe o Cliente'
  })
  @ApiProperty()
  client: {
    cnpj: string
    name: string
  }

  @IsNotEmpty({
    message: 'Informe os itens da fatura'
  })
  @ApiProperty({ type: [Object] })
  items: Array<{
    name: string
    quantity: number
    price: number
  }>

  @IsNotEmpty({
    message: 'Informe o status da fatura'
  })
  @ApiProperty()
  status: string

  @IsNotEmpty({
    message: 'Informe o valor total da fatura'
  })
  @IsInt()
  @Min(0)
  @ApiProperty()
  valor: number
}
