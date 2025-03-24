import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateLetterDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  senderRoomNumber: string;

  @IsString()
  @IsOptional()
  senderName?: string;

  @IsString()
  @IsNotEmpty()
  recipientRoomNumber: string;

  @IsBoolean()
  @IsOptional()
  isAnonymous: boolean = false;
}
