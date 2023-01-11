import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateRecipientDto } from '../dtos/create-recipient.dto';
import { UpdateRecipientDto } from '../dtos/update-recipient.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipient } from '../entities/recipient.entity';

@Injectable()
export class RecipientService {
  constructor(
    @InjectRepository(Recipient)
    private readonly recipientRepository: Repository<Recipient>,
  ) {}

  async index() {
    return await this.recipientRepository.find();
  }

  async store(createRecipientDto: CreateRecipientDto) {
    const recipient = this.recipientRepository.create(createRecipientDto);

    return await this.recipientRepository.save(recipient);
  }

  async show(recipient: string) {
    const recipientEntity = await this.recipientRepository.findOneBy({
      uuid: recipient,
    });

    if (!recipientEntity) {
      throw new NotFoundException('Recipient not found.');
    }

    return recipientEntity;
  }

  async update(recipient: string, updateRecipientDto: UpdateRecipientDto) {
    const recipientEntity = await this.recipientRepository.findOneBy({
      uuid: recipient,
    });

    if (!recipientEntity) {
      throw new NotFoundException('Recipient not found.');
    }

    delete updateRecipientDto['recipient'];

    if (Object.keys(updateRecipientDto).length === 0) {
      throw new BadRequestException('No data submitted to be updated.');
    }

    return this.recipientRepository.save(
      new Recipient({
        ...recipientEntity,
        ...updateRecipientDto,
      }),
    );
  }

  async delete(recipient: string) {
    const recipientEntity = await this.recipientRepository.findOneBy({
      uuid: recipient,
    });

    if (!recipientEntity) {
      throw new NotFoundException('Recipient not found.');
    }

    return await this.recipientRepository.remove(recipientEntity);
  }
}
