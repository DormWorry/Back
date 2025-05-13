import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  restaurantName: string;

  @IsString()
  category: string;

  @IsNumber()
  minimumOrderAmount: number;

  @IsNumber()
  deliveryFee: number;

  @IsString()
  @IsOptional()
  description?: string;
}
