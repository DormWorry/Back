import { IsNotEmpty, IsString, IsNumber, IsUUID } from 'class-validator';

export class CreateRoommateProfileDto {
  @IsNotEmpty()
  @IsNumber()
  myPersonalityTypeId: number;

  @IsNotEmpty()
  @IsNumber()
  preferredPersonalityTypeId: number;

  @IsNotEmpty()
  @IsString()
  kakaoTalkId: string;

  @IsString()
  instagramId: string;

  @IsNotEmpty()
  @IsString()
  introduction: string;

  @IsNotEmpty()
  @IsUUID()
  dormitoryId: string;
}
