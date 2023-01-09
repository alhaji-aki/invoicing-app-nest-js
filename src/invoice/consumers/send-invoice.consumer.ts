import { MailerService } from '@nestjs-modules/mailer';
import { OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'bull';
import { Invoice } from '../entities/invoice.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { SentStatus } from '../enum/sent-status.enum';

@Processor('invoices')
export class SendInvoiceConsumer {
  constructor(
    private readonly mailerService: MailerService,
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
  ) {}

  @Process('send-invoice-job')
  async process(job: Job<unknown>) {
    const invoice = await this.invoiceRepository.findOne({
      where: { id: job.data['invoice'] },
      relations: ['sender', 'recipient', 'invoiceLines'],
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found.');
    }

    if (invoice.sentStatus === SentStatus.SENDING) {
      return;
    }

    try {
      invoice.sentStatus = SentStatus.SENDING;
      await this.invoiceRepository.save(invoice);

      // TODO: generate invoice pdf and add it to the email
      await this.mailerService.sendMail({
        to: invoice.recipient.contactEmail,
        cc: invoice.recipient.ccEmails,
        subject: invoice.title,
        template: './invoice/templates/email',
        context: {
          name: invoice.recipient.contactName,
          title: invoice.title,
          description: invoice.description,
          sender: invoice.recipient.name,
          user: 'User', // TODO: replace this with the user's name
        },
      });

      invoice.sentStatus = SentStatus.SENT;
      await this.invoiceRepository.save(invoice);
    } catch (error) {
      invoice.sentStatus = SentStatus.FAILED;
      await this.invoiceRepository.save(invoice);

      throw error;
    }
  }

  @OnQueueFailed()
  onFailed(job: Job, err: Error) {
    console.log(err);
  }
}
