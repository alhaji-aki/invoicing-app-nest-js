import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async index() {
    return await this.userRepository.find();
  }

  async toggleAdmin(authUser: User, user: string) {
    const userEntity = await this.userRepository.findOne({
      where: { uuid: user },
    });

    if (!userEntity) {
      throw new NotFoundException('User not found.');
    }

    if (userEntity.id === authUser.id) {
      throw new ForbiddenException('You cannot change your own admin state.');
    }

    userEntity.isAdmin = !userEntity.isAdmin;
    this.userRepository.save(userEntity);
  }
}
