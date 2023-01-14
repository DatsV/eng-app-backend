import { UserEntity } from './../user/entities/user.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    @Inject(ConfigService)
    private readonly config: ConfigService,
  ) {}

  async sendUserConfirmation(
    user: Omit<UserEntity, 'password'>,
    token: string,
  ) {
    const url = `${this.config.get('CLIENT_HOST')}/activate?authtoken=${token}`;

    try {
      await this.mailerService.sendMail({
        to: user.email,

        subject: 'Welcome to Petya Dictionary! Confirm your Email',
        template: './confirmation',
        context: {
          url,
        },
      });
    } catch (error) {
      throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
    }
  }

  async sendRecoverPassword(user: Omit<UserEntity, 'password'>, token: string) {
    const url = `${this.config.get('CLIENT_HOST')}/recover?authtoken=${token}`;

    try {
      await this.mailerService.sendMail({
        to: user.email,

        subject: 'Recover Password',
        template: './recover',
        context: {
          url,
        },
      });
    } catch (error) {
      throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
    }
  }
}
