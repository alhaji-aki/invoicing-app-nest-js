import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '../../user/entities/user.entity';
import { ChangePasswordDto } from '../dtos/change-password.dto';
import { BadRequestException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateProfileDto } from '../dtos/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async update(user: User, updateProfileDto: UpdateProfileDto) {
    delete updateProfileDto.authUser;
    delete updateProfileDto.entity;

    if (Object.keys(updateProfileDto).length === 0) {
      throw new BadRequestException('No data submitted to be updated.');
    }

    return await this.userRepository.save(
      new User({ ...user, ...updateProfileDto }),
    );
  }

  async changePassword(user: User, changePasswordDto: ChangePasswordDto) {
    user.password = await bcrypt.hash(changePasswordDto.password, 10);

    return await this.userRepository.save(user);
  }
}
