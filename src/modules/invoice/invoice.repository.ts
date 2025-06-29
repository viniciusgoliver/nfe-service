import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { InvoiceStatus } from '@prisma/client'
import { type InvoiceCreateInvoiceDTO } from './dtos/create-invoice.dto'
import { type ReturnClientDTO } from './dtos/return-client.dto'
import { WebhookRetornoSefazDTO } from './dtos/webhook-retorno-sefaz.dto'

@Injectable()
export class InvoiceRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createInvoiceDto: InvoiceCreateInvoiceDTO): Promise<any> {
    const { clientId, userId, items } = createInvoiceDto
    const priceProducts = await this.prismaService.product.findMany({
      where: {
        id: {
          in: items.map((item) => item.productId)
        }
      },
      select: {
        id: true,
        price: true
      }
    })
    const created = await this.prismaService.invoice.create({
      data: {
        clientId,
        userId,
        status: InvoiceStatus.PROCESSING,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            total: priceProducts.find((p) => p.id === item.productId)?.price * item.quantity || 0
          }))
        }
      },
      include: { items: true }
    })

    return created
  }

  async findById(id: string): Promise<any> {
    return this.prismaService.invoice.findUnique({ where: { id } })
  }

  async findByIdXml(id: string): Promise<any> {
    return this.prismaService.invoice.findUnique({
      where: { id },
      include: {
        client: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        items: {
          include: {
            product: true
          }
        }
      }
    })
  }

  async updateStatus(dto: WebhookRetornoSefazDTO,): Promise<any> {
    const { invoiceId: id, status, protocol, message } = dto
    return this.prismaService.invoice.update({
      where: { id },
      data: {
        status,        
        protocol,
        message
      }
    })
  }

  async findClientById(clientId: string): Promise<ReturnClientDTO | null> {
    return this.prismaService.client.findUnique({ where: { id: clientId } })
  }

  async findProductsByIds(ids: string[]): Promise<Array<{ id: string; price: number }>> {
    return this.prismaService.product.findMany({
      where: { id: { in: ids } },
      select: { id: true, price: true }
    })
  }
}
