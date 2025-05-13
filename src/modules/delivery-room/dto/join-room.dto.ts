import { IsString, IsNumber, IsOptional } from 'class-validator';

export class JoinRoomDto {
  @IsString()
  deliveryRoomId: string;
  
  @IsString()
  @IsOptional()
  orderDetails?: string;
  
  @IsNumber()
  @IsOptional()
  amount?: number;
}
