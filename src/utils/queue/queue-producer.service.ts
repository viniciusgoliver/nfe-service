import { Injectable, Logger } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'
import { type UserCreateDTO } from '../../modules/user/dtos/user-create.dto'
import { type InvoiceReturnDTO } from 'src/modules/invoice/dtos/return-invoice.dto'

@Injectable()
class QueueProducerService {
  private readonly logger = new Logger(QueueProducerService.name)

  constructor(@InjectQueue('producer-queue') private readonly queue: Queue) {}

  async signUpJob(createUserDTO: UserCreateDTO): Promise<void> {
    await this.queue
      .add(
        'signUp-job',
        { createUserDTO },
        {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 1000
          }
        }
      )
      .then((job) => {
        this.logger.log(`Job ${job.id} added to queue`)
      })
      .catch((err) => {
        this.logger.error(err)
      })
  }

  async sendRecoverPasswordJob(email: string): Promise<void> {
    await this.queue
      .add(
        'sendRecoverPassword-job',
        { email },
        {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 1000
          }
        }
      )
      .then((job) => {
        this.logger.log(`Job ${job.id} added to queue`)
      })
      .catch((err) => {
        this.logger.error(err)
      })
  }

  async emmitInvoice(invoice: InvoiceReturnDTO): Promise<void> {
    await this.queue
      .add(
        'emit-invoice',
        { invoice },
        {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 1000
          }
        }
      )
      .then((job) => {
        this.logger.log(`Job ${job.id} added to queue for invoice emission`)
      })
      .catch((err) => {
        this.logger.error(err)
      })
  }
}

export { QueueProducerService }
