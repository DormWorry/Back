import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryChat } from './entities/delivery-chat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DeliveryChat])],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class DeliveryChatModule {}
