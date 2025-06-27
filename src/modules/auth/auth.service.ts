import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
  Logger,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { UserCreateDTO } from '../user/dtos/user-create.dto';
import { UserReturnUserDTO } from '../user/dtos/return-user.dto';
import { AuthCredentialsDTO } from './dtos/credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthReturnAuthUserDTO } from './dtos/return-auth-user.dto';
import { AuthRepository } from './auth.repository';
import { MailService } from '../../utils/mail.service';
import { UserService } from '../user/user.service';
import { AuthResetPasswordDTO } from './dtos/reset-password.dto';
import { environmentConfig } from '../../configs';
import { QueueProducerService } from '../../utils/queue/queue-producer.service';
import { validRefreshToken } from 'src/utils/helpers.util';
import {v4} from "uuid";
import { HttpService } from '@nestjs/axios';
import { UserReturnUserinfoDTO } from '../user/dtos/return-userinfo.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)
  private readonly environment = JSON.parse(
    JSON.stringify(environmentConfig()),
  );
  constructor(
    private readonly authRepository: AuthRepository,
    private jwtService: JwtService,
    private mailService: MailService,
    private readonly userService: UserService,
    private readonly queueProducerService: QueueProducerService,    
    private readonly http: HttpService
  ) {}

  async signUp(createUserDTO: UserCreateDTO): Promise<void> {
    
    if (createUserDTO.password !== createUserDTO.passwordConfirmation) {
      this.logger.error('As senhas não são iguais')
      throw new HttpException('As senhas não são iguais', HttpStatus.BAD_REQUEST)
    }

    if (await this.userByEmailExists(createUserDTO.email)) {
      this.logger.error('Já existe um usuário com este email')
      throw new HttpException('Já existe um usuário com este email', HttpStatus.BAD_REQUEST)
    }

    this.logger.log('Enviando job para fila')
    await this.queueProducerService.signUpJob(createUserDTO)
  }

  async saveUser(createDto: UserCreateDTO): Promise<UserReturnUserDTO> {
    try {
      if (createDto.password != createDto.passwordConfirmation) {
        throw new UnprocessableEntityException('As senhas não conferem');
      }

      const signup = await this.authRepository.signUp(createDto);
      const { email, confirmationToken } = signup;

      await this.mailService.sendConfirmationEmail({
        email,
        confirmationToken,
      });

      delete signup.confirmationToken;
      return signup;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new UnprocessableEntityException(
          'Já existe um usuário com este email',
        );
      } else {
        throw new UnprocessableEntityException(
          `Erro ao realizar o cadastro do usuário: ${error}`,
        );
      }
    }
  }

  async signIn(credentialsDto: AuthCredentialsDTO): Promise<AuthReturnAuthUserDTO> {
    const checkCredentials = await this.authRepository.checkCredentials(credentialsDto);    
    const sessionState = v4()
    const jwtPayload = {
      id: checkCredentials.id,
      email: checkCredentials.email,
      name: checkCredentials.name,
      role: checkCredentials.role,
      session_state: sessionState
    };
    const access_token = await this.jwtService.signAsync(jwtPayload);
    
    if (!access_token) {
      throw new NotFoundException('Acesso não autorizado');
    }

    const refresh_token = await this.jwtService.signAsync(jwtPayload, {
      secret: this.environment.app.jwtRefreshSecret,
      expiresIn: this.environment.app.jwtRefreshExpiresIn,
    });
    const expire_in = this.jwtService.decode(access_token)['exp'];
    const refresh_expire_in = this.jwtService.decode(refresh_token)['exp'];
    const token_type = 'Bearer';

    
    const ip = await this.getIpAddress()

    await this.authRepository.deleteSessionUserByIdUser(checkCredentials.id)
    await this.authRepository.createSessionUser({
      user_id: checkCredentials.id,
      session_state: sessionState,
      from_ip: ip,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return { access_token, refresh_token, expire_in, refresh_expire_in, token_type };
  }

  async refresh(refreshToken: string): Promise<AuthReturnAuthUserDTO> {    
    try {
      validRefreshToken(refreshToken)
    
      const { id, email, name, role } = await this.jwtService.verify(refreshToken, {
        secret: this.environment.app.jwtRefreshSecret,
      })

      if (!id) {
        throw new NotFoundException('Refresh token inválido');
      }

      const sessionState = v4();
      const jwtPayload = { id, email, name, role, session_state: sessionState };
      const access_token = await this.jwtService.signAsync(jwtPayload, {
        secret: this.environment.app.jwtSecret,
        expiresIn: this.environment.app.jwtExpiresIn,
      });
      
      if (!access_token) {
        throw new NotFoundException('Acesso não autorizado');
      }

      const expire_in = this.jwtService.decode(access_token)['exp'];
      const refresh_expire_in = this.jwtService.decode(refreshToken)['exp'];
      const token_session_state = this.jwtService.decode(refreshToken)['session_state'];
      const token_type = 'Bearer';        
      const ip = await this.getIpAddress()
      
      await this.authRepository.deleteSessionUser(token_session_state)
      await this.authRepository.createSessionUser({
        user_id: id,
        session_state: sessionState,
        from_ip: ip,
        created_at: new Date(),
        updated_at: new Date(),
      });

      return { access_token, refresh_token: refreshToken, expire_in, refresh_expire_in, token_type };
    } catch (error) {
      this.logger.error('Fluxo de refresh token inválido')
      throw new NotFoundException('Fluxo de refresh token inválido');
    }     
  }

  async verifyUserById(id: number): Promise<UserReturnUserDTO> {
    return await this.userExists(id);
  }

  async userExists(id: number): Promise<UserReturnUserDTO> {
    const user = await this.authRepository.verifyUserById(id);

    if (!user) {
      throw new NotFoundException('Acesso não autorizado');
    }

    return user;
  }

  async userByEmailExists(email: string): Promise<boolean> {
    const user = await this.authRepository.verifyUserByEmail(email);

    if (user) {
      return true;
    }

    return false;
  }

  async confirmationEmail(confirmationToken: string): Promise<void> {
    return await this.userService.confirmationEmail(confirmationToken);
  }

  async sendRecoverPasswordJob(email: string): Promise<void> {
    if (!await this.userByEmailExists(email)) {
      throw new NotFoundException('Email não encontrado');
    }
    
    return await this.queueProducerService.sendRecoverPasswordJob(email);
  }

  async recoverPasswordEmail(email: string): Promise<void> {
    const recoverToken = await this.userService.recoverPasswordEmail(email);

    return await this.mailService.sendRecoverPasswordEmail({
      email,
      recoverToken,
    });
  }

  async resetPassword(
    token: string,
    resetPasswordDto: AuthResetPasswordDTO,
  ): Promise<void> {
    return await this.userService.resetPassword(token, resetPasswordDto);
  }

  async getIpAddress(): Promise<string> {
    const { data } = await this.http.get('https://api.ipify.org?format=json').toPromise();    

    return data.ip;
  }

  async findSessionUser(sessionState: string): Promise<boolean> {
    return await this.authRepository.findSessionUser(sessionState);
  }

  async logout(user: UserReturnUserinfoDTO): Promise<void> {
    return await this.authRepository.deleteSessionUserByIdUser(user.id);
  }
}

