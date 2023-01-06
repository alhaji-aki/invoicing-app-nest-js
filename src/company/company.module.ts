import { Module } from '@nestjs/common';
import { SenderController } from './controllers/sender.controller';
import { SenderService } from './services/sender.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sender } from './entities/sender.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sender])],
  controllers: [SenderController],
  providers: [SenderService],
})
export class CompanyModule {}
