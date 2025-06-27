import { type MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from 'path';
import { type ConfigService } from '@nestjs/config';

export const mailerConfig = async (
  configService: ConfigService,
): Promise<MailerOptions> => {
  return {
    transport: {
      host: configService.get<string>('mailer.host'),
      port: configService.get<number>('mailer.port'),
      secure: false,
      auth: {
        user: configService.get<string>('mailer.auth.user'),
        pass: configService.get<string>('mailer.auth.pass'),
      },
    },
    template: {
      dir: path.resolve(__dirname, '..', '..', 'templates'),
      adapter: new HandlebarsAdapter(),
      options: {
        extName: '.hbs',
        layoutsDir: path.resolve(__dirname, '..', '..', 'templates'),
      },
    },
  };
};
