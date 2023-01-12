import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../../user/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ForgotPasswordDto } from '../dtos/forgot-password.dto';
import { PasswordReset } from '../entities/password-reset.entity';
import { ConfigService } from '@nestjs/config';
import * as moment from 'moment';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ResetPasswordDto } from '../dtos/reset-password.dto';

@Injectable()
export class PasswordService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(PasswordReset)
    private readonly tokenRepository: Repository<PasswordReset>,
    @InjectQueue('auth') private readonly queue: Queue,
  ) {}

  async sendResetToken(forgotPasswordDto: ForgotPasswordDto) {
    // get user
    const user = await this.getUser(forgotPasswordDto.email);

    if (!user) {
      throw new BadRequestException(
        'We could not find any users with this email address',
      );
    }

    // check if user has a recently created token
    if (await this.recentlyCreatedToken(user)) {
      throw new BadRequestException('Please wait before retrying.');
    }

    // create token
    const token = await this.createNewToken(user);

    // send email
    await this.queue.add('password-reset-job', {
      email: user.email,
      token,
    });
  }

  async reset(resetPasswordDto: ResetPasswordDto) {
    // get user
    const user = await this.getUser(resetPasswordDto.email);

    if (!user) {
      throw new BadRequestException(
        'We could not find any users with this email address',
      );
    }

    // check if token exists and has not expired
    if (!(await this.validateToken(user, resetPasswordDto.token))) {
      throw new BadRequestException('Invalid token submitted');
    }

    // reset the password
    user.password = await bcrypt.hash(resetPasswordDto.password, 10);
    await this.userRepository.save(user);

    // delete the token
    await this.deleteExistingToken(user);
  }

  private async validateToken(user: User, token: string) {
    const tokenEntity = await this.tokenRepository.findOneBy({
      email: user.email,
    });

    return (
      tokenEntity &&
      !this.tokenExpired(tokenEntity.createdAt) &&
      (await bcrypt.compare(token, tokenEntity.token))
    );
  }

  private tokenExpired(createdAt: Date) {
    return moment(createdAt)
      .add(this.configService.get<number>('auth.expires'), 'minutes')
      .isBefore();
  }

  private async getUser(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  private async recentlyCreatedToken(user: User) {
    const token = await this.tokenRepository.findOneBy({ email: user.email });

    return token && this.tokenRecentlyCreated(token.createdAt);
  }

  private tokenRecentlyCreated(createdAt: Date) {
    const throttle: number = this.configService.get<number>('auth.throttle');

    if (throttle <= 0) {
      return false;
    }

    return moment(createdAt).add(throttle, 'seconds').isAfter();
  }

  private async createNewToken(user: User) {
    await this.deleteExistingToken(user);

    const token = this.generateNewToken();

    const hashedToken = await bcrypt.hash(token, 10);

    await this.tokenRepository.save(
      this.tokenRepository.create({ email: user.email, token: hashedToken }),
    );

    return token;
  }

  private async deleteExistingToken(user: User) {
    await this.tokenRepository.delete({ email: user.email });
  }

  private generateNewToken() {
    const hmac = crypto.createHmac(
      'sha256',
      this.configService.get('auth.secret'),
    );
    return hmac.update(crypto.randomBytes(40).toString('hex')).digest('hex');
  }
}
