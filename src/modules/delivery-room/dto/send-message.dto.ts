import { IsString } from 'class-validator';

export class SendMessageDto {
  @IsString()
  roomId: string;
  
  @IsString()
  message: string;
}
