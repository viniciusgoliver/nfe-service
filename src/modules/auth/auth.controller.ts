import {
  Controller,
  Post,
  Get,
  Body,
  ValidationPipe,
  UseGuards,
  Patch,
  Param,
} from '@nestjs/common';
import { UserDTO } from '../user/dtos/user.dto';
import { AuthService } from './auth.service';
import { CredentialsDTO } from './dtos/credentials.dto';
import { ReturnAuthUserDTO } from './dtos/return-auth-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { ReturnUserinfoDTO } from '../user/dtos/return-userinfo.dto';
import { GetUser } from '../../decorator/get-user.decorator';
import { ResetPasswordDTO } from './dtos/reset-password.dto';
import { SendRecoverEmailDTO } from './dtos/send-recover-email.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller({ path: 'auth', version: '1' })
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body(ValidationPipe) userDto: UserDTO): Promise<object> {    
    const user = await this.authService.signUp(userDto);
    return {
      user,
      status: 'success',
      message: 'Usuário cadastrado com sucesso',
    };
  }

  @Post('signin')
  async signIn(
    @Body(ValidationPipe) credentialsDto: CredentialsDTO,
  ): Promise<ReturnAuthUserDTO> {
    return await this.authService.signIn(credentialsDto);
  }

  @Post('refresh')
  @UseGuards(AuthGuard())
  async refresh(
    @Body(ValidationPipe) data: { refresh_token: string },
  ): Promise<ReturnAuthUserDTO> {    
    return await this.authService.refresh(data.refresh_token);
  }

  @Get('userinfo')
  @UseGuards(AuthGuard())
  async getUserinfo(
    @GetUser() user: ReturnUserinfoDTO,
  ): Promise<ReturnUserinfoDTO> {    
    return user;
  }

  @Get('logout')
  @UseGuards(AuthGuard())
  async logout(
    @GetUser() user: ReturnUserinfoDTO,
  ): Promise<{ message: string }> {
    await this.authService.logout(user);
    return {
      message: 'Usuário deslogado com sucesso',
    };
  }

  @Get('/confirmation/:token')
  async confirmationEmail(@Param('token') token: string) {
    await this.authService.confirmationEmail(token);
    return {
      status: 'success',
      message: 'Email confirmado',
    };
  }

  @Post('/send-recover-email')
  async sendRecoverPasswordEmail(
    @Body(ValidationPipe) sendRecoverEmailDTO: SendRecoverEmailDTO,
  ): Promise<{ status: string; message: string }> {
    const { email } = sendRecoverEmailDTO;
    await this.authService.sendRecoverPasswordJob(email);
    return {
      status: 'success',
      message: 'Foi enviado um email com instruções para resetar sua senha',
    };
  }

  @Patch('/reset-password/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body(ValidationPipe) data: ResetPasswordDTO,
  ): Promise<{ message: string }> {
    await this.authService.resetPassword(token, data);
    return {
      message: 'Senha alterada com sucesso',
    };
  }
}
