import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnprocessableEntityException,
  Logger
} from '@nestjs/common'
import { InvoiceRepository } from './invoice.repository'
import { type InvoiceCreateInvoiceDTO } from './dtos/create-invoice.dto'
import { QueueProducerService } from 'src/utils/queue/queue-producer.service'
import { InvoiceStatus } from '@prisma/client'
import { validateXmlWithXsd } from 'src/utils/xml-validator.util'
import { cnpj } from 'cpf-cnpj-validator'
import { type WebhookRetornoSefazDTO } from './dtos/webhook-retorno-sefaz.dto'

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

      const client = await this.invoiceRepository.findClientById(createInvoiceDto.clientId)
      if (!client) {
        this.logger.warn(`Cliente com ID ${createInvoiceDto.clientId} não encontrado`)
        throw new NotFoundException(`Cliente ${createInvoiceDto.clientId} não encontrado`)
      }

      if (!cnpj.isValid(client.cnpj)) {
        this.logger.warn(`CNPJ inválido para o cliente ${client.id}: ${client.cnpj}`)
        throw new BadRequestException('CNPJ do cliente é inválido')
      }
      const ieRegex = /^\d{9,14}$/
      if (!ieRegex.test(client.ie)) {
        this.logger.warn(`Inscrição Estadual inválida para o cliente ${client.id}: ${client.ie}`)
        throw new BadRequestException('Inscrição Estadual do cliente é inválida')
      }

      if (!createInvoiceDto.items || createInvoiceDto.items.length === 0) {
        this.logger.warn('Invoice sem itens')
        throw new BadRequestException('Invoice deve ter ao menos um item')
      }

      const productIds = createInvoiceDto.items.map((i) => i.productId)
      const priceProducts = await this.invoiceRepository.findProductsByIds(productIds)
      if (priceProducts.length !== productIds.length) {
        this.logger.warn(`Algum produto não encontrado em ${productIds.join(', ')}`)
        throw new NotFoundException('Um ou mais produtos não foram encontrados')
      }

      const invoiceCreated = await this.invoiceRepository.create(createInvoiceDto)
      const invoice = await this.invoiceRepository.findByIdXml(invoiceCreated.id)

      this.logger.log(`NF-e criada com sucesso, ID: ${invoice.id}`)

      await this.queueProducerService.emmitInvoice(invoice)

      return invoice
    } catch (error: any) {
      if (error.code === 'P2002') {
        this.logger.error('Tentativa de criar invoice com GUID duplicado', error)
        throw new UnprocessableEntityException('Já existe uma fatura com este GUID')
      }
      this.logger.error('Erro ao criar NF-e', error.stack)
      throw error
    }
  }

  async findById(id: string): Promise<any> {
    const invoice = await this.invoiceRepository.findById(id)
    if (!invoice) {
      throw new UnprocessableEntityException('Fatura não encontrada')
    }
    if (invoice.status !== InvoiceStatus.AUTHORIZED) {
      throw new BadRequestException('NF-e não autorizada')
    }
    return invoice
  }

  async findByIdXml(id: string): Promise<string> {
    const invoice = await this.invoiceRepository.findById(id)
    if (!invoice) {
      throw new UnprocessableEntityException('Fatura não encontrada')
    }
    if (invoice.status !== InvoiceStatus.AUTHORIZED) {
      throw new BadRequestException('NF-e não autorizada')
    }

    try {
      validateXmlWithXsd(invoice.xml)
    } catch (e: any) {
      throw new BadRequestException(e.message)
    }

    return invoice.xml
  }

  async updateStatus(dto: WebhookRetornoSefazDTO): Promise<any> {
    const invoice = await this.invoiceRepository.updateStatus(dto)
    if (!invoice) {
      throw new UnprocessableEntityException('Fatura não encontrada')
    }
    return invoice
  }

  async processSefazCallback(dto: WebhookRetornoSefazDTO): Promise<void> {
    const { invoiceId, status } = dto
    await this.invoiceRepository.updateStatusWebhook(dto)
    this.logger.log(`Callback SEFAZ processado para NF-e ${invoiceId}: ${status}`)
  }
}
