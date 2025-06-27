import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InvoiceStatus } from '@prisma/client';
import { InvoiceCreateInvoiceDTO } from './dtos/create-invoice.dto';

@Injectable()
export class InvoiceRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createInvoiceDto: InvoiceCreateInvoiceDTO): Promise<any> {
    try {
      const { clientId, userId, items } = createInvoiceDto;
      const created = await this.prismaService.invoice.create({
        data: {
          clientId,
          userId,
          status: InvoiceStatus.PROCESSING,
          items: {
            create: items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              total: 0,
            })),
          },
        },
        include: { items: true },
      });

      return created;
    } catch (err) {
      throw err;
    }
  }
  
}
