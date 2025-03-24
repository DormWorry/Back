import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryRoom } from './entities/delivery-room.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DeliveryRoom])],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class DeliveryRoomModule {}
