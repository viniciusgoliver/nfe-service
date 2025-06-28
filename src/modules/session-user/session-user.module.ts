import { Module } from '@nestjs/common'
import { SessionUserRepository } from './session-user.repository'
import { SessionUserService } from './session-user.service'
import { SessionUserController } from './session-user.controller'
import { PassportModule } from '@nestjs/passport'

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [SessionUserService, SessionUserRepository],
  controllers: [SessionUserController],
  exports: [PassportModule]
})
export class SessionUserModule {}
