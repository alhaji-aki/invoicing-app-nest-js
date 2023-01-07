import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Invoice } from './entities/invoice.entity';
import { Recipient } from '../company/entities/recipient.entity';
import { Sender } from '../company/entities/sender.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomInt } from 'crypto';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(Sender)
    private readonly senderRepository: Repository<Sender>,
    @InjectRepository(Recipient)
    private readonly recipientRepository: Repository<Recipient>,
  ) {}

  async index() {
    return await this.invoiceRepository.find({
      relations: ['sender', 'recipient'],
    });
  }

  async store(createInvoiceDto: CreateInvoiceDto) {
    // TODO store invoice lines
    const sender = await this.senderRepository.findOne({
      where: { uuid: createInvoiceDto.sender },
    });

    const recipient = await this.recipientRepository.findOne({
      where: { uuid: createInvoiceDto.recipient },
    });

    const invoice = this.invoiceRepository.create({
      ...createInvoiceDto,
      invoiceNo: await this.generateInvoiceNo(),
      sender,
      recipient,
    });

    return await this.invoiceRepository.save(invoice);
  }

  async show(invoice: string) {
    // TODO: show invoice lines
    const invoiceEntity = await this.invoiceRepository.findOne({
      where: { uuid: invoice },
      relations: ['sender', 'recipient'],
    });

    if (!invoiceEntity) {
      throw new NotFoundException('Invoice not found.');
    }

    return invoiceEntity;
  }

  async update(invoice: string, updateInvoiceDto: UpdateInvoiceDto) {
    const invoiceEntity = await this.invoiceRepository.findOneBy({
      uuid: invoice,
    });

    if (!invoiceEntity) {
      throw new NotFoundException('Invoice not found.');
    }

    if (Object.keys(updateInvoiceDto).length === 0) {
      throw new BadRequestException('No data submitted to be updated.');
    }

    const sender =
      updateInvoiceDto.sender &&
      (await this.senderRepository.findOne({
        where: { uuid: updateInvoiceDto.sender },
      }));

    const recipient =
      updateInvoiceDto.recipient &&
      (await this.recipientRepository.findOne({
        where: { uuid: updateInvoiceDto.recipient },
      }));

    console.log({
      ...invoiceEntity,
      ...updateInvoiceDto,
      sender,
      recipient,
    });

    return this.invoiceRepository.save({
      ...invoiceEntity,
      ...updateInvoiceDto,
      sender,
      recipient,
    });
  }

  async delete(invoice: string) {
    // TODO: delete invoice lines
    const invoiceEntity = await this.invoiceRepository.findOneBy({
      uuid: invoice,
    });

    if (!invoiceEntity) {
      throw new NotFoundException('Invoice not found.');
    }

    return await this.invoiceRepository.remove(invoiceEntity);
  }

  private async generateInvoiceNo(): Promise<string> {
    // TODO: get last inserted invoice id and add 1 to it to get a the invoice id of the new invoice
    const number = randomInt(10000000, 99999999);
    const invoiceNo = `INV-${number}`;

    console.log(''.padStart(8, '0'));
    while (await this.invoiceRepository.exist({ where: { invoiceNo } })) {
      this.generateInvoiceNo();
    }

    return invoiceNo;
  }
}
