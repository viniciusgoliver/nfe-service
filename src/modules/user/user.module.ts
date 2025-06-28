import { Module } from '@nestjs/common'
import { UserRepository } from './user.repository'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { PassportModule } from '@nestjs/passport'

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [UserService, UserRepository],
  controllers: [UserController],
  exports: [PassportModule]
})
export class UserModule {}
