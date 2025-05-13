import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryParticipant } from './entities/delivery-participant.entity';
import { DeliveryParticipantController } from './delivery-participant.controller';
import { DeliveryParticipantService } from './delivery-participant.service';
import { DeliveryRoom } from '../delivery-room/entities/delivery-room.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DeliveryParticipant, DeliveryRoom, User])],
  controllers: [DeliveryParticipantController],
  providers: [DeliveryParticipantService],
  exports: [TypeOrmModule, DeliveryParticipantService],
})
export class DeliveryParticipantModule {}
