import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Invoice } from '../entities/invoice.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { InvoiceLine } from '../entities/invoice-line.entity';
import { CreateInvoiceLineDto } from '../dto/create-invoice-line.dto';
import { UpdateInvoiceLineDto } from '../dto/update-invoice-line.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class InvoiceLineService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(InvoiceLine)
    private readonly invoiceLineRepository: Repository<InvoiceLine>,
    private readonly dataSource: DataSource,
  ) {}

  async store(
    user: User,
    invoice: string,
    createInvoiceLineDto: CreateInvoiceLineDto,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const invoiceEntity = await this.invoiceRepository.findOne({
        where: { uuid: invoice },
      });

      if (!invoiceEntity || invoiceEntity.userId !== user.id) {
        throw new NotFoundException('Invoice not found.');
      }

      const invoiceLine = queryRunner.manager.create(InvoiceLine, {
        ...createInvoiceLineDto,
        invoice: invoiceEntity,
      });

      await queryRunner.manager.save(invoiceLine);

      invoiceEntity.amount =
        +invoiceEntity.amount + createInvoiceLineDto.amount;

      await queryRunner.manager.save(invoiceEntity);

      await queryRunner.commitTransaction();

      return invoiceLine;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async update(
    user: User,
    invoice: string,
    invoiceLine: string,
    updateInvoiceLineDto: UpdateInvoiceLineDto,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const invoiceEntity = await this.invoiceRepository.findOneBy({
        uuid: invoice,
      });

      if (!invoiceEntity || invoiceEntity.userId !== user.id) {
        throw new NotFoundException('Invoice not found.');
      }

      const invoiceLineEntity = await this.invoiceLineRepository.findOneBy({
        uuid: invoiceLine,
        invoiceId: invoiceEntity.id,
      });

      if (!invoiceLineEntity) {
        throw new NotFoundException('Invoice line not found.');
      }

      if (Object.keys(updateInvoiceLineDto).length === 0) {
        throw new BadRequestException('No data submitted to be updated.');
      }

      const updatedInvoiceLine = await queryRunner.manager.save(
        new InvoiceLine({
          ...invoiceLineEntity,
          ...updateInvoiceLineDto,
        }),
      );

      // update invoice amount if changed
      if (
        updateInvoiceLineDto.amount &&
        updatedInvoiceLine.amount !== invoiceLineEntity.amount
      ) {
        // add the updated amount to the invoice and subtract the old amount from the invoice
        invoiceEntity.amount =
          +invoiceEntity.amount +
          +updatedInvoiceLine.amount -
          +invoiceLineEntity.amount;

        await queryRunner.manager.save(invoiceEntity);
      }

      await queryRunner.commitTransaction();

      return updatedInvoiceLine;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async delete(user: User, invoice: string, invoiceLine: string) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const invoiceEntity = await this.invoiceRepository.findOneBy({
        uuid: invoice,
      });

      if (!invoiceEntity || invoiceEntity.userId !== user.id) {
        throw new NotFoundException('Invoice not found.');
      }

      const invoiceLineEntity = await this.invoiceLineRepository.findOneBy({
        uuid: invoiceLine,
        invoiceId: invoiceEntity.id,
      });

      if (!invoiceLineEntity) {
        throw new NotFoundException('Invoice line not found.');
      }

      await queryRunner.manager.remove(invoiceLineEntity);

      invoiceEntity.amount = +invoiceEntity.amount - +invoiceLineEntity.amount;

      await queryRunner.manager.save(invoiceEntity);

      await queryRunner.commitTransaction();

      return invoiceLineEntity;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
