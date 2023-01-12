import { MailerService } from '@nestjs-modules/mailer';
import { OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ConfigService } from '@nestjs/config';

@Processor('auth')
export class PasswordResetConsumer {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  @Process('password-reset-job')
  async process(job: Job<unknown>) {
    const token = job.data['token'];
    const email = job.data['email'];

    const url =
      this.configService.get('app.frontend_password_reset_url') +
      `?token=${token}&email=${email}`;

    const appName = this.configService.get('app.name');
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Reset Password Notification',
        template: './templates/auth/password-reset',
        context: { url, appName },
      });
    } catch (error) {
      throw error;
    }
  }

  @OnQueueFailed()
  onFailed(job: Job, err: Error) {
    console.error(err);
  }
}
