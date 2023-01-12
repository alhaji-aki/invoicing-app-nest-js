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
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class SenderService {
  constructor(
    @InjectRepository(Sender)
    private readonly senderRepository: Repository<Sender>,
  ) {}

  async index(user: User) {
    return await this.senderRepository.find({
      where: { userId: user.id },
    });
  }

  async store(user: User, createSenderDto: CreateSenderDto) {
    const sender = this.senderRepository.create({
      ...createSenderDto,
      userId: user.id,
    });

    return await this.senderRepository.save(sender);
  }

  async show(user: User, sender: string) {
    const senderEntity = await this.senderRepository.findOneBy({
      uuid: sender,
    });

    if (!senderEntity || senderEntity.userId !== user.id) {
      throw new NotFoundException('Sender not found.');
    }

    return senderEntity;
  }

  async update(user: User, sender: string, updateSenderDto: UpdateSenderDto) {
    const senderEntity = await this.senderRepository.findOneBy({
      uuid: sender,
    });

    if (!senderEntity || senderEntity.userId !== user.id) {
      throw new NotFoundException('Sender not found.');
    }

    delete updateSenderDto['entity'];
    delete updateSenderDto['authUser'];

    if (Object.keys(updateSenderDto).length === 0) {
      throw new BadRequestException('No data submitted to be updated.');
    }

    return this.senderRepository.save(
      new Sender({ ...senderEntity, ...updateSenderDto }),
    );
  }

  async delete(user: User, sender: string) {
    const senderEntity = await this.senderRepository.findOneBy({
      uuid: sender,
    });

    if (!senderEntity || senderEntity.userId !== user.id) {
      throw new NotFoundException('Sender not found.');
    }

    return await this.senderRepository.remove(senderEntity);
  }
}
