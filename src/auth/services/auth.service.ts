import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../../user/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { InviteService } from 'src/user/services/invite.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly inviteService: InviteService,
    private readonly dataSource: DataSource,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.findByEmail(email);

    if (!user) {
      return null;
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return null;
    }

    return user;
  }

  private async findByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findById(id: number) {
    return await this.userRepository.findOne({ where: { id } });
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(createUserDto: CreateUserDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const invite = await this.inviteService.findByEmail(createUserDto.email);

      if (
        !invite ||
        !(await this.inviteService.validInvite(invite, createUserDto.token))
      ) {
        throw new BadRequestException('Invalid token submitted');
      }

      const user = this.userRepository.create({
        name: createUserDto.name,
        email: createUserDto.email,
        password: await bcrypt.hash('password', 10),
      });

      await this.userRepository.save(user);

      this.inviteService.markAsAccepted(invite);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
