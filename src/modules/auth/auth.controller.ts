import { Controller, Post, Get, Body, ValidationPipe, UseGuards, Patch, Param } from '@nestjs/common'
import { UserCreateDTO } from '../user/dtos/user-create.dto'
import { AuthService } from './auth.service'
import { AuthCredentialsDTO } from './dtos/credentials.dto'
import { type AuthReturnAuthUserDTO } from './dtos/return-auth-user.dto'
import { AuthGuard } from '@nestjs/passport'
import { UserReturnUserinfoDTO } from '../user/dtos/return-userinfo.dto'
import { GetUser } from '../../decorator/get-user.decorator'
import { AuthResetPasswordDTO } from './dtos/reset-password.dto'
import { AuthSendRecoverEmailDTO } from './dtos/send-recover-email.dto'
import { ApiTags } from '@nestjs/swagger'

export class AuthRefreshTokenDTO {
  refresh_token: string
}

@Controller({ path: 'auth', version: '1' })
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body(ValidationPipe) userDto: UserCreateDTO): Promise<{ status: string; message: string }> {
    await this.authService.signUp(userDto)
    return {
      status: 'success',
      message: 'Usuário cadastrado com sucesso'
    }
  }

  @Post('signin')
  async signIn(@Body(ValidationPipe) credentialsDto: AuthCredentialsDTO): Promise<AuthReturnAuthUserDTO> {
    return await this.authService.signIn(credentialsDto)
  }

  @Post('refresh')
  @UseGuards(AuthGuard())
  async refresh(@Body(ValidationPipe) data: AuthRefreshTokenDTO): Promise<AuthReturnAuthUserDTO> {
    return await this.authService.refresh(data.refresh_token)
  }

  @Get('userinfo')
  @UseGuards(AuthGuard())
  async getUserinfo(@GetUser() user: UserReturnUserinfoDTO): Promise<UserReturnUserinfoDTO> {
    return user
  }

  @Get('logout')
  @UseGuards(AuthGuard())
  async logout(@GetUser() user: UserReturnUserinfoDTO): Promise<{ message: string }> {
    await this.authService.logout(user)
    return {
      message: 'Usuário deslogado com sucesso'
    }
  }

  @Get('/confirmation/:token')
  async confirmationEmail(@Param('token') token: string): Promise<{ status: string; message: string }> {
    await this.authService.confirmationEmail(token)
    return {
      status: 'success',
      message: 'Email confirmado'
    }
  }

  @Post('/send-recover-email')
  async sendRecoverPasswordEmail(
    @Body(ValidationPipe) sendRecoverEmailDTO: AuthSendRecoverEmailDTO
  ): Promise<{ status: string; message: string }> {
    const { email } = sendRecoverEmailDTO
    await this.authService.sendRecoverPasswordJob(email)
    return {
      status: 'success',
      message: 'Foi enviado um email com instruções para resetar sua senha'
    }
  }

  @Patch('/reset-password/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body(ValidationPipe) data: AuthResetPasswordDTO
  ): Promise<{ message: string }> {
    await this.authService.resetPassword(token, data)
    return {
      message: 'Senha alterada com sucesso'
    }
  }
}
