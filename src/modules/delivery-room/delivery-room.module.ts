import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryRoom } from './entities/delivery-room.entity';
import { DeliveryRoomController } from './delivery-room.controller';
import { DeliveryRoomService } from './delivery-room.service';
import { DeliveryRoomGateway } from './delivery-room.gateway';
import { User } from '../user/entities/user.entity';
import { DeliveryParticipantModule } from '../delivery-participant/delivery-participant.module';
import { DeliveryChatModule } from '../delivery-chat/delivery-chat.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DeliveryRoom, User]),
    DeliveryParticipantModule,
    DeliveryChatModule,
  ],
  controllers: [DeliveryRoomController],
  providers: [DeliveryRoomService, DeliveryRoomGateway],
  exports: [TypeOrmModule, DeliveryRoomService],
})
export class DeliveryRoomModule {}
