import { ApiProperty } from '@nestjs/swagger'
import { InvoiceReturnDTO } from './return-invoice.dto'

/**
 * DTO para retorno de dados de um cliente e suas notas fiscais
 */
export class ReturnClientDTO {
  @ApiProperty({ description: 'Identificador único do cliente', example: 'd290f1ee-6c54-4b01-90e6-d701748f0851' })
  id: string

  @ApiProperty({ description: 'Nome do cliente', example: 'Empresa XYZ Ltda' })
  name: string

  @ApiProperty({ description: 'CNPJ do cliente', example: '12.345.678/0001-95' })
  cnpj: string

  @ApiProperty({ description: 'Inscrição Estadual do cliente', example: '123456789' })
  ie: string

  @ApiProperty({ description: 'Data de criação do registro' })
  createdAt: Date

  @ApiProperty({ description: 'Data de última atualização do registro' })
  updatedAt: Date

  @ApiProperty({ type: [InvoiceReturnDTO], description: 'Lista de notas fiscais associadas ao cliente' })
  invoices?: InvoiceReturnDTO[]
}
