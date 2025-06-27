import { Module } from '@nestjs/common';
import { InvoiceRepository } from './invoice.repository';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { PassportModule } from '@nestjs/passport';
import { QueueProducerService } from 'src/utils/queue-producer.service';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }), 
    BullModule.registerQueue({
      name: 'producer-queue',
    })
  ],
  providers: [
    InvoiceService, 
    InvoiceRepository, 
    QueueProducerService
  ],
  controllers: [InvoiceController],
  exports: [PassportModule],
})
export class InvoiceModule {}
