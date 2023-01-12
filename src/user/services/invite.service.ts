import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Invite } from '../entities/invite.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SendInviteDto } from '../dtos/send-invite.dto';
import * as moment from 'moment';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { User } from '../entities/user.entity';

@Injectable()
export class InviteService {
  constructor(
    @InjectRepository(Invite)
    private readonly inviteRepository: Repository<Invite>,
    private readonly configService: ConfigService,
    @InjectQueue('users') private readonly queue: Queue,
  ) {}

  async index() {
    return await this.inviteRepository.find({
      withDeleted: true,
      relations: ['invitedBy'],
    });
  }

  async store(user: User, sendInviteDto: SendInviteDto) {
    const { token, hashed } = await this.generateNewToken();

    await this.inviteRepository.save(
      this.inviteRepository.create({
        email: sendInviteDto.email,
        token: hashed,
        invitedById: user.id,
      }),
    );

    // send email
    await this.queue.add('invite-job', {
      email: sendInviteDto.email,
      token,
    });
  }

  async delete(invite: string) {
    const inviteEntity = await this.inviteRepository.findOne({
      where: { uuid: invite },
      withDeleted: true,
    });

    if (!inviteEntity) {
      throw new NotFoundException('Invite not found.');
    }

    // check if invite is expired or claimed
    if (
      this.inviteExpired(inviteEntity.createdAt) ||
      this.inviteClaimed(inviteEntity) ||
      this.inviteDeleted(inviteEntity)
    ) {
      throw new ForbiddenException(
        'You cannot revoke expired, claimed or already revoked invites',
      );
    }

    await this.inviteRepository.softRemove(inviteEntity);
  }

  async resend(user: User, invite: string) {
    const inviteEntity = await this.inviteRepository.findOne({
      where: { uuid: invite },
      withDeleted: true,
    });

    if (!inviteEntity) {
      throw new NotFoundException('Invite not found.');
    }

    // check if invite is claimed
    if (this.inviteClaimed(inviteEntity)) {
      throw new ForbiddenException('You cannot resend claimed invites');
    }

    const { token, hashed } = await this.generateNewToken();

    await this.inviteRepository.save(
      new Invite({
        ...inviteEntity,
        token: hashed,
        invitedById: user.id,
        createdAt: new Date(),
        deletedAt: null,
      }),
    );

    // send email
    await this.queue.add('invite-job', {
      email: inviteEntity.email,
      token,
    });
  }

  async findByEmail(email: string) {
    return await this.inviteRepository.findOne({
      where: { email },
      withDeleted: true,
    });
  }

  async validInvite(invite: Invite, token: string) {
    if (
      !(await bcrypt.compare(token, invite.token)) ||
      this.inviteExpired(invite.createdAt) ||
      this.inviteDeleted(invite) ||
      this.inviteClaimed(invite)
    ) {
      return false;
    }

    return true;
  }

  async markAsAccepted(invite: Invite) {
    invite.acceptedAt = new Date();
    this.inviteRepository.save(invite);
  }

  private async generateNewToken() {
    const hmac = crypto.createHmac(
      'sha256',
      this.configService.get('auth.secret'),
    );
    const token = hmac
      .update(crypto.randomBytes(40).toString('hex'))
      .digest('hex');

    const hashed = await bcrypt.hash(token, 10);

    return { token, hashed };
  }

  private inviteExpired(createdAt: Date) {
    return moment(createdAt)
      .add(this.configService.get<number>('auth.expires'), 'minutes')
      .isBefore();
  }

  private inviteClaimed(invite: Invite) {
    return invite.acceptedAt !== null;
  }

  private inviteDeleted(invite: Invite) {
    return invite.deletedAt !== null;
  }
}
