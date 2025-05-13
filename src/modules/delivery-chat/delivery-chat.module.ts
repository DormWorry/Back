import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryChat } from './entities/delivery-chat.entity';
import { DeliveryChatController } from './delivery-chat.controller';
import { DeliveryChatService } from './delivery-chat.service';
import { DeliveryRoom } from '../delivery-room/entities/delivery-room.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DeliveryChat, DeliveryRoom, User])],
  controllers: [DeliveryChatController],
  providers: [DeliveryChatService],
  exports: [TypeOrmModule, DeliveryChatService],
})
export class DeliveryChatModule {}
