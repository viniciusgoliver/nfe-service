import { ApiProperty } from '@nestjs/swagger'

export class WebhookRetornoSefazDTO {
  @ApiProperty({ example: 'invoice-uuid-123', description: 'ID da NF-e' })
  invoiceId: string

  @ApiProperty({ example: 'AUTHORIZED', enum: ['AUTHORIZED', 'REJECTED'], description: 'Status da NF-e' })
  status: 'AUTHORIZED' | 'REJECTED'

  @ApiProperty({ example: '123456789', required: false, description: 'Protocolo da autorização SEFAZ' })
  protocol?: string

  @ApiProperty({ example: '<xml>...</xml>', required: false, description: 'XML da nota autorizada' })
  xml?: string

  @ApiProperty({ example: 'Nota autorizada', required: false, description: 'Mensagem adicional' })
  message?: string
}
