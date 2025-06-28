import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { InvoiceStatus } from '@prisma/client'
import { type InvoiceCreateInvoiceDTO } from './dtos/create-invoice.dto'

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

  async updateStatus(id: string,
    status: InvoiceStatus,
    xml?: string,
    protocol?: string,
    message?: string): Promise<any> {
      return this.prismaService.invoice.update({
        where: { id },
        data: {
          status,
          xml,
          protocol,
          message,
        },
      });
  }
}
