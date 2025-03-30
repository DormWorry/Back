import { IsNotEmpty, IsString, IsNumber, IsUUID } from 'class-validator';

export class CreateDeliveryParticipantDto {
  @IsNotEmpty()
  @IsUUID()
  deliveryRoomId: string;

  @IsNotEmpty()
  @IsString()
  orderDetails: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
