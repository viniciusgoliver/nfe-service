import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../../strategy/jwt.strategy';
import { MailService } from '../../utils/mail.service';
import { UserService } from '../user/user.service';
import { UserRepository } from '../user/user.repository';
import { environmentConfig, redisConfig } from '../../configs';
import { BullModule, InjectQueue } from '@nestjs/bull';
import { BullAdapter } from 'bull-board/bullAdapter'
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QueueProducerService } from '../../utils/queue-producer.service';
import { QueueConsumerService } from '../../utils/queue-consumer.service';
import { Queue } from 'bull';
import { MiddlewareBuilder } from '@nestjs/core';
import { createBullBoard } from 'bull-board'

const environment = JSON.parse(JSON.stringify(environmentConfig()));

@Module({
  imports: [        
    HttpModule,
    PassportModule.register({ defaultStrategy: environment.app.jwtStrategy }),
    JwtModule.register({
      secret: environment.app.jwtSecret,
      signOptions: {
        expiresIn: environment.app.jwtExpiresIn,
      },
    }),
    BullModule.registerQueue({
      name: 'producer-queue',
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: redisConfig,
    }),    
  ],
  providers: [
    AuthService,
    AuthRepository,
    JwtStrategy,
    MailService,
    UserService,
    UserRepository,
    QueueProducerService,
    QueueConsumerService,    
  ],
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {
  constructor(@InjectQueue('producer-queue') private readonly producerQueue: Queue) {}

  async configure(consumer: MiddlewareBuilder): Promise<void> {
    const { router } = createBullBoard([new BullAdapter(this.producerQueue)])
    consumer.apply(router).forRoutes('/admin/queues')
  }
}

