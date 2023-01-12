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
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class RecipientService {
  constructor(
    @InjectRepository(Recipient)
    private readonly recipientRepository: Repository<Recipient>,
  ) {}

  async index(user: User) {
    return await this.recipientRepository.find({
      where: { userId: user.id },
    });
  }

  async store(user: User, createRecipientDto: CreateRecipientDto) {
    const recipient = this.recipientRepository.create({
      ...createRecipientDto,
      userId: user.id,
    });

    return await this.recipientRepository.save(recipient);
  }

  async show(user: User, recipient: string) {
    const recipientEntity = await this.recipientRepository.findOneBy({
      uuid: recipient,
    });

    if (!recipientEntity || recipientEntity.userId !== user.id) {
      throw new NotFoundException('Recipient not found.');
    }

    return recipientEntity;
  }

  async update(
    user: User,
    recipient: string,
    updateRecipientDto: UpdateRecipientDto,
  ) {
    const recipientEntity = await this.recipientRepository.findOneBy({
      uuid: recipient,
    });

    if (!recipientEntity || recipientEntity.userId !== user.id) {
      throw new NotFoundException('Recipient not found.');
    }

    delete updateRecipientDto['entity'];
    delete updateRecipientDto['authUser'];

    if (Object.keys(updateRecipientDto).length === 0) {
      throw new BadRequestException('No data submitted to be updated.');
    }

    return this.recipientRepository.save(
      new Recipient({ ...recipientEntity, ...updateRecipientDto }),
    );
  }

  async delete(user: User, recipient: string) {
    const recipientEntity = await this.recipientRepository.findOneBy({
      uuid: recipient,
    });

    if (!recipientEntity || recipientEntity.userId !== user.id) {
      throw new NotFoundException('Recipient not found.');
    }

    return await this.recipientRepository.remove(recipientEntity);
  }
}
