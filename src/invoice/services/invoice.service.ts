import {
  BadRequestException,
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
  ) {}

  async index() {
    return await this.invoiceRepository.find({
      relations: ['sender', 'recipient'],
    });
  }

  async store(createInvoiceDto: CreateInvoiceDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const sender = await this.senderRepository.findOne({
        where: { uuid: createInvoiceDto.sender },
      });

      const recipient = await this.recipientRepository.findOne({
        where: { uuid: createInvoiceDto.recipient },
      });

      const amount = createInvoiceDto.invoiceLines.reduce(
        (acc, val) => acc + val.amount,
        0,
      );

      const invoice = queryRunner.manager.create(Invoice, {
        ...createInvoiceDto,
        invoiceNo: await this.generateInvoiceNo(),
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

      return { ...invoice, invoiceLines };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async show(invoice: string) {
    const invoiceEntity = await this.invoiceRepository.findOne({
      where: { uuid: invoice },
      relations: ['sender', 'recipient', 'invoiceLines'],
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

    return this.invoiceRepository.save({
      ...invoiceEntity,
      ...updateInvoiceDto,
      sender,
      recipient,
    });
  }

  async delete(invoice: string) {
    const invoiceEntity = await this.invoiceRepository.findOneBy({
      uuid: invoice,
    });

    if (!invoiceEntity) {
      throw new NotFoundException('Invoice not found.');
    }

    return await this.invoiceRepository.remove(invoiceEntity);
  }

  private async generateInvoiceNo(): Promise<string> {
    const number = randomInt(10000000, 99999999);
    const invoiceNo = `INV-${number}`;

    while (await this.invoiceRepository.exist({ where: { invoiceNo } })) {
      this.generateInvoiceNo();
    }

    return invoiceNo;
  }
}
