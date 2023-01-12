import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { InviteService } from './services/invite.service';
import { Invite } from './entities/invite.entity';
import { InviteController } from './controllers/invite.controller';
import { BullModule } from '@nestjs/bull';
import { InviteConsumer } from './consumers/invite.consumer';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Invite]),
    BullModule.registerQueue({
      name: 'users',
    }),
  ],
  providers: [UserService, InviteService, InviteConsumer],
  controllers: [UserController, InviteController],
  exports: [InviteService],
})
export class UserModule {}
