import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PrismaModule } from './modules/prisma/prisma.module'
import { UserModule } from './modules/user/user.module'
import { AuthModule } from './modules/auth/auth.module'
import { winstonConfig } from './configs/winston.config'
import { WinstonModule } from 'nest-winston'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { LoggerInterceptor } from './interceptors/logger.interceptor'
import { mailerConfig } from './configs/mailer.config'
import { MailerModule } from '@nestjs-modules/mailer'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { environmentConfig, validationSchema } from './configs'
import { DevtoolsModule } from '@nestjs/devtools-integration'
import { SessionUserModule } from './modules/session-user/session-user.module'
import { InvoiceModule } from './modules/invoice/invoice.module'
import { QueueModule } from './utils/queue/queue.module'

@Module({
  imports: [
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production'
    }),
    ConfigModule.forRoot({
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      envFilePath: '.env',
      expandVariables: process.env.NODE_ENV !== 'production',
      isGlobal: true,
      load: [environmentConfig],
      validationSchema,
      cache: process.env.NODE_ENV === 'production'
    }),
    WinstonModule.forRoot(winstonConfig),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: mailerConfig
    }),
    PrismaModule,
    UserModule,
    AuthModule,
    SessionUserModule,
    InvoiceModule,
    QueueModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor
    }
  ]
})
export class AppModule {}
