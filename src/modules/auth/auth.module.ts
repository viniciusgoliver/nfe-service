import { HttpModule } from '@nestjs/axios'
import { forwardRef, Module } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../../strategy/jwt.strategy';
import { MailService } from '../../utils/mail.service';
import { UserService } from '../user/user.service';
import { UserRepository } from '../user/user.repository';
import { environmentConfig } from '../../configs';
import { QueueModule } from '../../utils/queue/queue.module';

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
    forwardRef(() => QueueModule),
  ],
  providers: [
    AuthService,
    AuthRepository,
    JwtStrategy,
    MailService,
    UserService,
    UserRepository,    
  ],
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule, AuthService],
})
export class AuthModule {}

