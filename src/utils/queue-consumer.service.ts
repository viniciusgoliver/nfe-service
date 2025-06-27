import { Logger } from '@nestjs/common'
import { Processor, Process, OnQueueCompleted, OnQueueActive, OnQueueFailed } from '@nestjs/bull'
import { Job } from 'bull'
import { AuthService } from '../modules/auth/auth.service'
import { type UserDTO } from '../modules/user/dtos/user.dto'

@Processor('producer-queue')
class QueueConsumerService {
  private readonly logger = new Logger(QueueConsumerService.name)

  constructor(private readonly authService: AuthService) {}

  @Process('signUp-job')
  async signUpJob(job: Job<UserDTO>): Promise<void> {
    const { data } = job

    await this.authService.saveUser(data)
  }

  @Process('sendRecoverPassword-job')
  async sendRecoverPasswordJob(job: Job<{ email: string }>): Promise<void> {
    const { data } = job

    await this.authService.recoverPasswordEmail(data.email)
  }

  @OnQueueCompleted()
  @OnQueueActive()
  onActive(job: Job): void {
    this.logger.log(`On Active ${job.name}`)
  }

  @OnQueueFailed()
  onError(job: Job<any>, error: any): void {
    this.logger.error(`On Error ${job.name}`)
    this.logger.error(error)
  }

  onCompleted(job: Job): void {
    this.logger.log(`On Completed ${job.name}`)
  }
}

export { QueueConsumerService }
