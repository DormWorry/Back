import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateRoommateProfileDto {
  @IsNumber()
  @IsNotEmpty()
  myPersonalityTypeId: number;

  @IsNumber()
  @IsNotEmpty()
  preferredPersonalityTypeId: number;

  @IsString()
  @IsNotEmpty()
  kakaoTalkId: string;

  @IsString()
  @IsOptional()
  instagramId: string;

  @IsString()
  @IsNotEmpty()
  introduction: string;

  @IsString()
  @IsNotEmpty()
  dormitoryId: string;
}
