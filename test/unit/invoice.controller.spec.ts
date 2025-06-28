import { Test, TestingModule } from '@nestjs/testing'
import { InvoiceController } from 'src/modules/invoice/invoice.controller'
import { InvoiceService } from 'src/modules/invoice/invoice.service'
import { WebhookRetornoSefazDTO } from 'src/modules/invoice/dtos/webhook-retorno-sefaz.dto'

describe('InvoiceController', () => {
  let controller: InvoiceController
  let service: InvoiceService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoiceController],
      providers: [
        {
          provide: InvoiceService,
          useValue: {
            processSefazCallback: jest.fn()
          } as Partial<InvoiceService>
        }
      ]
    }).compile()

    controller = module.get<InvoiceController>(InvoiceController)
    service = module.get<InvoiceService>(InvoiceService)
  })

  it('deve processar o webhook e retornar status ok', async () => {
    const dto: WebhookRetornoSefazDTO = {
      invoiceId: 'mock-id',
      status: 'AUTHORIZED',
      protocol: '123456',
      xml: '<xml>...</xml>',
      message: 'Nota autorizada'
    }

    // Não é necessário mockResolvedValue se o método só faz await, mas ok para garantir:
    jest.spyOn(service, 'processSefazCallback').mockResolvedValue(undefined)

    const result = await controller.retornoSefaz(dto)
    expect(service.processSefazCallback).toHaveBeenCalledWith(
      dto.invoiceId, dto.status, dto.protocol, dto.xml, dto.message
    )
    expect(result).toEqual({ status: 'ok', invoiceId: dto.invoiceId })
  })

  it('deve lançar erro se service falhar', async () => {
    const dto: WebhookRetornoSefazDTO = {
      invoiceId: 'mock-id',
      status: 'REJECTED'
    }

    jest.spyOn(service, 'processSefazCallback').mockRejectedValue(new Error('Erro simulado'))

    await expect(controller.retornoSefaz(dto)).rejects.toThrow('Erro simulado')
  })
})