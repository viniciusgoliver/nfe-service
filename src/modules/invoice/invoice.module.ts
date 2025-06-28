import { forwardRef, Module } from '@nestjs/common'
import { InvoiceRepository } from './invoice.repository'
import { InvoiceService } from './invoice.service'
import { InvoiceController } from './invoice.controller'
import { PassportModule } from '@nestjs/passport'
import { BullModule } from '@nestjs/bull'
import { QueueModule } from 'src/utils/queue/queue.module'

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    BullModule.registerQueue({
      name: 'producer-queue'
    }),
    forwardRef(() => QueueModule)
  ],
  providers: [InvoiceService, InvoiceRepository],
  controllers: [InvoiceController],
  exports: [PassportModule, InvoiceService]
})
export class InvoiceModule {}
