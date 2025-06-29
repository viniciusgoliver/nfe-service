import { Module } from '@nestjs/common'
import { AppController } from '../../src/app.controller'
import { AppService } from '../../src/app.service'
import { PrismaModule } from '../../src/modules/prisma/prisma.module'
import { UserModule } from '../../src/modules/user/user.module'
import { AuthModule } from '../../src/modules/auth/auth.module'

@Module({
  imports: [PrismaModule, UserModule, AuthModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppTestModule {}
