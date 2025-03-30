import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryChat } from './entities/delivery-chat.entity';
import { DeliveryChatGateway } from './delivery-chat.gateway';
import { User } from '../user/entities/user.entity';
import { DeliveryRoom } from '../delivery-room/entities/delivery-room.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DeliveryChat, User, DeliveryRoom])],
  controllers: [],
  providers: [DeliveryChatGateway],
  exports: [TypeOrmModule],
})
export class DeliveryChatModule {}
