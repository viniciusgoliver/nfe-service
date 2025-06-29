import { Logger } from '@nestjs/common'
import { Processor, Process, OnQueueCompleted, OnQueueActive, OnQueueFailed } from '@nestjs/bull'
import { Job } from 'bull'
import { AuthService } from '../../modules/auth/auth.service'
import { type UserCreateDTO } from '../../modules/user/dtos/user-create.dto'
import { InvoiceStatus } from '@prisma/client'
import { InvoiceService } from 'src/modules/invoice/invoice.service'
import { type InvoiceXmlDataDTO } from 'src/modules/invoice/dtos/invoice-xml-data.dto'
import { xmlLayout } from '../xml-layout.util'

@Processor('producer-queue')
class QueueConsumerService {
  private readonly logger = new Logger(QueueConsumerService.name)

  constructor(
    private readonly authService: AuthService,
    private readonly invoiceService: InvoiceService
  ) {}

  @Process('signUp-job')
  async signUpJob(job: Job<UserCreateDTO>): Promise<void> {
    const { data } = job

    await this.authService.saveUser(data)
  }

  @Process('sendRecoverPassword-job')
  async sendRecoverPasswordJob(job: Job<{ email: string }>): Promise<void> {
    const { data } = job

    await this.authService.recoverPasswordEmail(data.email)
  }

  @Process('emit-invoice')
  async handleEmitInvoice(job: Job) {
    const { invoice } = job.data
    await new Promise((resolve) => setTimeout(resolve, 12000))
    const status = Math.random() > 0.2 ? InvoiceStatus.AUTHORIZED : InvoiceStatus.REJECTED
    let xml = ''

    const data: InvoiceXmlDataDTO = {
      client: {
        cnpj: invoice.client.cnpj,
        name: invoice.client.name
      },
      items: invoice.items.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price
      })),
      status,
      valor: invoice.items.reduce((acc, item) => acc + item.total, 0)
    }

    if (status === InvoiceStatus.AUTHORIZED) {
      xml = xmlLayout(data)
    } else if (invoice.status === InvoiceStatus.REJECTED) {
      xml = `<nfe>
        <status>${invoice.status}</status>
        <message>${invoice.message ?? 'NF-e rejeitada'}</message>
      </nfe>`
    } else {
      xml = `<nfe>
        <status>${invoice.status}</status>
        <message>${invoice.message ?? 'NF-e em processamento'}</message>
      </nfe>`
    }

    await this.invoiceService.updateStatus({
      invoiceId: invoice.id,
      status,
      protocol: `NFPROC${Math.floor(10000000 + Math.random() * 90000000)}`,
      xml,
      message: `NOTA PROCESSADA COM COM STATUS: ${status}`
    })
  }

  @OnQueueCompleted()
  @OnQueueActive()
  onActive(job: Job): void {
    this.logger.log(`Processing queue job: ${job.name} - ${job.id}`)
  }

  @OnQueueFailed()
  onError(job: Job<any>, error: any): void {
    this.logger.error(`Error processing queue job: ${job.name} - ${job.id}`)
    this.logger.error(error)
  }

  onCompleted(job: Job): void {
    this.logger.log(`Finished processing queue job: ${job.name} - ${job.id}`)
  }
}

export { QueueConsumerService }
