import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class UpdateRoommateProfileDto {
  @IsNumber()
  @IsOptional()
  myPersonalityTypeId?: number;

  @IsNumber()
  @IsOptional()
  preferredPersonalityTypeId?: number;

  @IsString()
  @IsOptional()
  kakaoTalkId?: string;

  @IsString()
  @IsOptional()
  instagramId?: string;

  @IsString()
  @IsOptional()
  introduction?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
