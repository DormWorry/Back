import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryRoom } from './entities/delivery-room.entity';
import { DeliveryRoomController } from './delivery-room.controller';
import { DeliveryRoomService } from './delivery-room.service';

@Module({
  imports: [TypeOrmModule.forFeature([DeliveryRoom])],
  controllers: [DeliveryRoomController],
  providers: [DeliveryRoomService],
  exports: [TypeOrmModule, DeliveryRoomService],
})
export class DeliveryRoomModule {}
