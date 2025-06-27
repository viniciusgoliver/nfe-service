import {
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InvoiceRepository } from './invoice.repository';
import { type CreateInvoiceDTO } from './dtos/create-invoice.dto';
import { QueueProducerService } from 'src/utils/queue-producer.service';

@Injectable()
export class InvoiceService {
  constructor(
    private readonly invoiceRepository: InvoiceRepository, 
    private readonly queueProducerService: QueueProducerService
  ) {}

  async create(createInvoiceDto: CreateInvoiceDTO): Promise<any> {
    try {
      const invoice = await this.invoiceRepository.create(createInvoiceDto);
      await this.queueProducerService.createInvoiceJob(createInvoiceDto)

      return invoice;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new UnprocessableEntityException(
          'Já existe uma fatura com este GUID',
        );
      }
      throw error;
    }
  }  
}
