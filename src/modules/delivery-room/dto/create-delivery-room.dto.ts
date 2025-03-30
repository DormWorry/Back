import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { FoodCategory } from '../constants/category.constants';

export class CreateDeliveryRoomDto {
  @IsNotEmpty()
  @IsString()
  restaurantName: string;

  @IsNotEmpty()
  @IsEnum(FoodCategory)
  category: string;

  @IsNotEmpty()
  @IsNumber()
  minimumOrderAmount: number;

  @IsNotEmpty()
  @IsNumber()
  deliveryFee: number;

  @IsNotEmpty()
  @IsString()
  description: string;
}
