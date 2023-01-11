import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateSenderDto } from '../dtos/create-sender.dto';
import { UpdateSenderDto } from '../dtos/update-sender.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sender } from '../entities/sender.entity';

@Injectable()
export class SenderService {
  constructor(
    @InjectRepository(Sender)
    private readonly senderRepository: Repository<Sender>,
  ) {}

  async index() {
    return await this.senderRepository.find();
  }

  async store(createSenderDto: CreateSenderDto) {
    const sender = this.senderRepository.create(createSenderDto);

    return await this.senderRepository.save(sender);
  }

  async show(sender: string) {
    const senderEntity = await this.senderRepository.findOneBy({
      uuid: sender,
    });

    if (!senderEntity) {
      throw new NotFoundException('Sender not found.');
    }

    return senderEntity;
  }

  async update(sender: string, updateSenderDto: UpdateSenderDto) {
    const senderEntity = await this.senderRepository.findOneBy({
      uuid: sender,
    });

    if (!senderEntity) {
      throw new NotFoundException('Sender not found.');
    }

    delete updateSenderDto['sender'];

    if (Object.keys(updateSenderDto).length === 0) {
      throw new BadRequestException('No data submitted to be updated.');
    }

    return this.senderRepository.save(
      new Sender({ ...senderEntity, ...updateSenderDto }),
    );
  }

  async delete(sender: string) {
    const senderEntity = await this.senderRepository.findOneBy({
      uuid: sender,
    });

    if (!senderEntity) {
      throw new NotFoundException('Sender not found.');
    }

    return await this.senderRepository.remove(senderEntity);
  }
}
