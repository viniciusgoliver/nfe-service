import { BadRequestException, NotFoundException } from '@nestjs/common'
import { InvoiceService } from 'src/modules/invoice/invoice.service'
import { type InvoiceRepository } from 'src/modules/invoice/invoice.repository'
import { type QueueProducerService } from 'src/utils/queue/queue-producer.service'
import { type InvoiceCreateInvoiceDTO } from 'src/modules/invoice/dtos/create-invoice.dto'

describe('InvoiceService', () => {
  let service: InvoiceService
  let repo: jest.Mocked<InvoiceRepository>
  let queue: jest.Mocked<QueueProducerService>

  beforeEach(() => {
    repo = {
      findClientById: jest.fn(),
      findProductsByIds: jest.fn(),
      create: jest.fn(),
      findByIdXml: jest.fn()
    } as any

    queue = {
      emmitInvoice: jest.fn()
    } as any

    service = new InvoiceService(repo, queue)
  })

  it('deve criar uma nota fiscal com sucesso', async () => {
    const payload = {
      clientId: 'cliente-123',
      userId: 1,
      items: [{ productId: 'prod-abc', quantity: 2 }]
    } as InvoiceCreateInvoiceDTO

    repo.findClientById.mockResolvedValue({
      id: payload.clientId,
      cnpj: '12345678000195',
      ie: '123456789',
      name: 'Cliente Teste',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    repo.findProductsByIds.mockResolvedValue([{ id: 'prod-abc', price: 42 }])
    repo.create.mockResolvedValue({ id: 'nota-1', ...payload })
    repo.findByIdXml.mockResolvedValue({
      id: 'nota-1',
      ...payload,
      xml: '<xml />'
    })

    const result = await service.create(payload)

    expect(repo.findClientById).toHaveBeenCalledWith(payload.clientId)
    expect(repo.findProductsByIds).toHaveBeenCalledWith(payload.items.map((i) => i.productId))
    expect(repo.create).toHaveBeenCalledWith(payload)
    expect(repo.findByIdXml).toHaveBeenCalledWith('nota-1')
    expect(queue.emmitInvoice).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'nota-1',
        clientId: 'cliente-123',
        userId: 1,
        items: [{ productId: 'prod-abc', quantity: 2 }]
      })
    )
    expect(result).toHaveProperty('xml', '<xml />')
    expect(result).toHaveProperty('id', 'nota-1')
  })

  it('deve lançar BadRequestException se payload for nulo', async () => {
    await expect(service.create(null)).rejects.toThrow(BadRequestException)
  })

  it('deve lançar NotFoundException se cliente não existir', async () => {
    repo.findClientById.mockResolvedValue(null)
    await expect(
      service.create({
        clientId: 'x',
        userId: 1,
        items: [{ productId: 'p', quantity: 1 }]
      } as any)
    ).rejects.toThrow(NotFoundException)
  })

  it('deve lançar BadRequestException se não houver itens', async () => {
    repo.findClientById.mockResolvedValue({
      id: 'c',
      cnpj: '12345678000195',
      ie: '123456789',
      name: 'Cliente Teste',
      createdAt: new Date(),
      updatedAt: new Date()
    })
    await expect(service.create({ clientId: 'c', userId: 1, items: [] } as any)).rejects.toThrow(BadRequestException)
  })

  it('deve lançar NotFoundException se algum produto não existir', async () => {
    repo.findClientById.mockResolvedValue({
      id: 'c',
      cnpj: '12345678000195',
      ie: '123456789',
      name: 'Cliente Teste',
      createdAt: new Date(),
      updatedAt: new Date()
    })
    repo.findProductsByIds.mockResolvedValue([])
    await expect(
      service.create({
        clientId: 'c',
        userId: 1,
        items: [{ productId: 'p', quantity: 1 }]
      } as any)
    ).rejects.toThrow(NotFoundException)
  })
})
