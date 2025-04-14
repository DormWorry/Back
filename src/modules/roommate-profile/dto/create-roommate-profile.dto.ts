import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateRoommateProfileDto {
  @IsNumber()
  @IsNotEmpty()
  myPersonalityTypeId: number;

  @IsNumber()
  @IsNotEmpty()
  preferredPersonalityTypeId: number;

  @IsString()
  @IsOptional()
  kakaoTalkId?: string;

  @IsString()
  @IsOptional()
  instagramId?: string;

  @IsString()
  @IsNotEmpty()
  introduction: string;
}
