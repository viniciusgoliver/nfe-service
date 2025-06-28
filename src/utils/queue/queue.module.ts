import { forwardRef, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { BullModule, InjectQueue } from '@nestjs/bull';
import { QueueProducerService } from './queue-producer.service';
import { QueueConsumerService } from './queue-consumer.service';
import { Queue } from 'bull';
import { createBullBoard } from 'bull-board';
import { BullAdapter } from 'bull-board/bullAdapter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisConfig } from 'src/configs';
import { AuthModule } from 'src/modules/auth/auth.module';
import { InvoiceModule } from 'src/modules/invoice/invoice.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'producer-queue',
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: redisConfig,
    }),    
    forwardRef(() => AuthModule),
    forwardRef(() => InvoiceModule)
  ],
  providers: [QueueProducerService, QueueConsumerService],
  exports: [QueueProducerService, QueueConsumerService, BullModule],
})

export class QueueModule implements NestModule {
  constructor(
    @InjectQueue('producer-queue')
    private readonly producerQueue: Queue,
  ) {}

  configure(consumer: MiddlewareConsumer): void {
    const { router } = createBullBoard([new BullAdapter(this.producerQueue)]);
    consumer.apply(router).forRoutes('admin/queues');
  }
}