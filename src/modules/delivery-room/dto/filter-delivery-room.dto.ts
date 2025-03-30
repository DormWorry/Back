import { IsOptional, IsEnum, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { FoodCategory } from '../constants/category.constants';
import { DeliveryRoomStatus } from '../entities/delivery-room.entity';

export class FilterDeliveryRoomDto {
  @IsOptional()
  @IsEnum(FoodCategory)
  category?: string;

  @IsOptional()
  @IsEnum(DeliveryRoomStatus)
  status?: DeliveryRoomStatus;
}
