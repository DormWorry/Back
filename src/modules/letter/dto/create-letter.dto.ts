import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class CreateLetterDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  senderUserId: string;

  @IsString()
  @IsNotEmpty()
  senderRoomNumber: string;

  @IsString()
  @IsOptional()
  senderName?: string;

  @IsString()
  @IsNotEmpty()
  recipientUserId: string;

  @IsString()
  @IsNotEmpty()
  recipientRoomNumber: string;

  @IsBoolean()
  @IsOptional()
  isAnonymous: boolean = false;

  @IsUUID()
  @IsOptional()
  originalLetterId?: string;
}
