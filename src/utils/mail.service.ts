import { RecoverPasswordEmailDTO } from '../modules/auth/dtos/recover-password-email.dto';
import { SendConfirmationEmailDTO } from '../modules/auth/dtos/send-confirmation-email.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { environmentConfig } from '../configs';

@Injectable()
@Injectable()
export class MailService {
  private readonly environment = JSON.parse(
    JSON.stringify(environmentConfig()),
  );
  constructor(private readonly mailerService: MailerService) {}

  async sendConfirmationEmail(
    sendConfirmationEmailDTO: SendConfirmationEmailDTO,
  ): Promise<void> {
    const { email, confirmationToken } = sendConfirmationEmailDTO;
    const mail = {
      to: email,
      from: 'noreply@application.com',
      subject: 'Email de confirmação',
      template: './email-confirmation',
      context: {
        url: `${this.environment.app.url}/auth/confirmation/${confirmationToken}`,
      },
    };

    await this.mailerService.sendMail(mail).catch((error) => {
      throw new UnprocessableEntityException(
        `Erro ao enviar o email de confirmação: ${error}`,
      );
    });
  }

  async sendRecoverPasswordEmail(
    recoverPassword: RecoverPasswordEmailDTO,
  ): Promise<void> {
    const { email, recoverToken } = recoverPassword;
    const mail = {
      to: email,
      from: 'noreply@application.com',
      subject: 'Recuperação de senha',
      template: './recover-password',
      context: {
        url: `${this.environment.app.frontendUrl}/authentication/alter-password//${recoverToken}`,
      },
    };
    await this.mailerService.sendMail(mail).catch((error) => {
      throw new UnprocessableEntityException(
        `Erro ao enviar o email de recuperação de senha: ${error}`,
      );
    });
  }
}
