import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryParticipant } from './entities/delivery-participant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DeliveryParticipant])],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class DeliveryParticipantModule {}
