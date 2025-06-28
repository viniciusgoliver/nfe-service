import { BadRequestException, Injectable, UnprocessableEntityException, Logger } from '@nestjs/common'
import { InvoiceRepository } from './invoice.repository'
import { type InvoiceCreateInvoiceDTO } from './dtos/create-invoice.dto'
import { QueueProducerService } from '../../utils/queue/queue-producer.service'
import { InvoiceStatus } from '@prisma/client'
import { validateXmlWithXsd } from 'src/utils/xml-validator.util'

@Injectable()
export class InvoiceService {
  private readonly logger = new Logger(InvoiceService.name)
  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    private readonly queueProducerService: QueueProducerService
  ) {}

  async create(createInvoiceDto: InvoiceCreateInvoiceDTO): Promise<any> {
    try {
      if (!createInvoiceDto) {
        this.logger.warn('Tentativa de criação de invoice com payload vazio')
        throw new BadRequestException('Payload inválido')
      }
      const invoiceCreated = await this.invoiceRepository.create(createInvoiceDto)
      const invoice = await this.invoiceRepository.findByIdXml(invoiceCreated.id)
      await this.queueProducerService.emmitInvoice(invoice)

      this.logger.log(`NF-e criada com sucesso, ID: ${invoice.id}`)
      return invoice
    } catch (error) {
      if (error.code === 'P2002') {
        this.logger.error('Tentativa de criar invoice com GUID duplicado', error)
        throw new UnprocessableEntityException('Já existe uma fatura com este GUID')
      }

      this.logger.error('Erro ao criar NF-e', error.stack)
      throw error
    }
  }

  async findByIdXml(id: string): Promise<string> {
    const invoice = await this.invoiceRepository.findById(id)

    if (!invoice) throw new UnprocessableEntityException('Fatura não encontrada')

    if (invoice.status !== InvoiceStatus.AUTHORIZED) throw new BadRequestException('NF-e não autorizada')

    const xmlString = invoice.xml

    try {
      validateXmlWithXsd(xmlString)
    } catch (e) {
      throw new BadRequestException(e.message)
    }

    return invoice.xml
  }

  async findById(id: string): Promise<any> {
    const invoice = await this.invoiceRepository.findById(id)

    if (!invoice) throw new UnprocessableEntityException('Fatura não encontrada')

    if (invoice.status !== InvoiceStatus.AUTHORIZED) throw new BadRequestException('NF-e não autorizada')

    return invoice
  }

  async updateStatus(id: string, status: InvoiceStatus, xml: string): Promise<any> {
    const invoice = await this.invoiceRepository.updateStatus(id, status, xml)

    if (!invoice) throw new UnprocessableEntityException('Fatura não encontrada')

    return invoice
  }

  async processSefazCallback(
    invoiceId: string,
    status: 'AUTHORIZED' | 'REJECTED',
    protocol?: string,
    xml?: string,
    message?: string
  ): Promise<void> {    
    await this.invoiceRepository.updateStatus(invoiceId, status, xml, protocol, message);
    this.logger.log(`[SEFAZ CALLBACK] NF-e ${invoiceId} status=${status} protocol=${protocol} message=${message}`);    
  }
}
