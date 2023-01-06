import { Module } from '@nestjs/common';
import { SenderController } from './controllers/sender.controller';
import { RecipientController } from './controllers/recipient.controller';
import { RecipientService } from './services/recipient.service';
import { SenderService } from './services/sender.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sender } from './entities/sender.entity';
import { Recipient } from './entities/recipient.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sender, Recipient])],
  controllers: [SenderController, RecipientController],
  providers: [SenderService, RecipientService],
})
export class CompanyModule {}
