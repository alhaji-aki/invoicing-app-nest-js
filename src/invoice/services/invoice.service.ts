import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateInvoiceDto } from '../dto/create-invoice.dto';
import { UpdateInvoiceDto } from '../dto/update-invoice.dto';
import { Invoice } from '../entities/invoice.entity';
import { Recipient } from '../../company/entities/recipient.entity';
import { Sender } from '../../company/entities/sender.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { randomInt } from 'crypto';
import { InvoiceLine } from '../entities/invoice-line.entity';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { MarkAsPaidDto } from '../dto/mark-as-paid.dto';
import { readFileSync } from 'fs';
import { join } from 'path';
import puppeteer from 'puppeteer';
import * as Handlebars from 'handlebars';
import * as moment from 'moment';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(Sender)
    private readonly senderRepository: Repository<Sender>,
    @InjectRepository(Recipient)
    private readonly recipientRepository: Repository<Recipient>,
    private readonly dataSource: DataSource,
    @InjectQueue('invoices') private readonly queue: Queue,
  ) {}

  async index(user: User) {
    return await this.invoiceRepository.find({
      where: { userId: user.id },
      relations: ['sender', 'recipient'],
    });
  }

  async store(user: User, createInvoiceDto: CreateInvoiceDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const sender = await this.senderRepository.findOne({
        where: { uuid: createInvoiceDto.sender, userId: user.id },
      });

      const recipient = await this.recipientRepository.findOne({
        where: { uuid: createInvoiceDto.recipient, userId: user.id },
      });

      const amount = createInvoiceDto.invoiceLines.reduce(
        (acc, val) => acc + val.amount,
        0,
      );

      const invoice = queryRunner.manager.create(Invoice, {
        ...createInvoiceDto,
        invoiceNo: await this.generateInvoiceNo(),
        userId: user.id,
        amount,
        sender,
        recipient,
      });

      await queryRunner.manager.save(invoice);

      const invoiceLines = createInvoiceDto.invoiceLines.map((invoiceLine) =>
        queryRunner.manager.create(InvoiceLine, { ...invoiceLine, invoice }),
      );

      await queryRunner.manager.save(invoiceLines);

      await queryRunner.commitTransaction();

      return new Invoice({ ...invoice, invoiceLines });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async show(user: User, invoice: string) {
    const invoiceEntity = await this.invoiceRepository.findOne({
      where: { uuid: invoice },
      relations: ['sender', 'recipient', 'invoiceLines'],
    });

    if (!invoiceEntity || invoiceEntity.userId !== user.id) {
      throw new NotFoundException('Invoice not found.');
    }

    return invoiceEntity;
  }

  async update(
    user: User,
    invoice: string,
    updateInvoiceDto: UpdateInvoiceDto,
  ) {
    const invoiceEntity = await this.invoiceRepository.findOneBy({
      uuid: invoice,
    });

    if (!invoiceEntity || invoiceEntity.userId !== user.id) {
      throw new NotFoundException('Invoice not found.');
    }

    delete updateInvoiceDto.authUser;
    delete updateInvoiceDto.entity;

    if (Object.keys(updateInvoiceDto).length === 0) {
      throw new BadRequestException('No data submitted to be updated.');
    }

    const sender =
      updateInvoiceDto.sender &&
      (await this.senderRepository.findOne({
        where: { uuid: updateInvoiceDto.sender, userId: user.id },
      }));

    const recipient =
      updateInvoiceDto.recipient &&
      (await this.recipientRepository.findOne({
        where: { uuid: updateInvoiceDto.recipient, userId: user.id },
      }));

    return this.invoiceRepository.save(
      new Invoice({
        ...invoiceEntity,
        ...updateInvoiceDto,
        sender,
        recipient,
      }),
    );
  }

  async delete(user: User, invoice: string) {
    const invoiceEntity = await this.invoiceRepository.findOneBy({
      uuid: invoice,
    });

    if (!invoiceEntity || invoiceEntity.userId !== user.id) {
      throw new NotFoundException('Invoice not found.');
    }

    return await this.invoiceRepository.remove(invoiceEntity);
  }

  async send(user: User, invoice: string) {
    const invoiceEntity = await this.invoiceRepository.findOne({
      where: { uuid: invoice },
    });

    if (!invoiceEntity || invoiceEntity.userId !== user.id) {
      throw new NotFoundException('Invoice not found.');
    }

    await this.queue.add('send-invoice-job', {
      invoice: invoiceEntity.id,
    });
  }

  async markAsPaid(user: User, invoice: string, markAsPaidDto: MarkAsPaidDto) {
    const invoiceEntity = await this.invoiceRepository.findOne({
      where: { uuid: invoice },
    });

    if (!invoiceEntity || invoiceEntity.userId !== user.id) {
      throw new NotFoundException('Invoice not found.');
    }

    if (invoiceEntity.paidAt) {
      throw new ForbiddenException('Invoice is already paid for.');
    }

    invoiceEntity.paidAt = markAsPaidDto.paidAt || new Date();

    return await this.invoiceRepository.save(invoiceEntity);
  }

  async downloadPDF(user: User, invoice: string) {
    const invoiceEntity = await this.invoiceRepository.findOne({
      where: { uuid: invoice },
      relations: ['sender', 'recipient', 'invoiceLines'],
    });

    if (!invoiceEntity || invoiceEntity.userId !== user.id) {
      throw new NotFoundException('Invoice not found.');
    }

    const buffer = await this.generatePDF(invoiceEntity);

    return { invoice: invoiceEntity, buffer };
  }

  async generatePDF(invoice: Invoice) {
    const templatePath = join(__dirname, '../../templates/invoice/pdf.hbs');
    const htmlContents = readFileSync(templatePath, { encoding: 'utf-8' });
    Handlebars.registerHelper('formatDate', (context, block) =>
      moment(context).format(block),
    );
    Handlebars.registerHelper('iteration', (context) => context + 1);

    const template = Handlebars.compile(htmlContents);

    const content = template({ invoice });

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(content);

    const buffer = await page.pdf({
      format: 'A4',
      printBackground: false,
      margin: {
        left: '0px',
        top: '0px',
        right: '0px',
        bottom: '0px',
      },
    });

    await browser.close();

    return buffer;
  }

  private async generateInvoiceNo() {
    const number = randomInt(10000000, 99999999);
    const invoiceNo = `INV-${number}`;

    while (await this.invoiceRepository.exist({ where: { invoiceNo } })) {
      await this.generateInvoiceNo();
    }

    return invoiceNo;
  }
}
