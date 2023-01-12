import { MailerService } from '@nestjs-modules/mailer';
import { OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ConfigService } from '@nestjs/config';

@Processor('users')
export class InviteConsumer {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  @Process('invite-job')
  async process(job: Job<unknown>) {
    const token = job.data['token'];
    const email = job.data['email'];

    const url =
      this.configService.get('app.frontend_register_url') +
      `?token=${token}&email=${email}`;

    const appName = this.configService.get('app.name');
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: `${appName} Invite`,
        template: './templates/auth/register',
        context: {
          url,
          appName,
          expires: this.configService.get<number>('auth.expires'),
        },
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
