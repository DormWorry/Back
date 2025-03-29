import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsBoolean,
} from 'class-validator';

// Gender enum 직접 정의
export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export class ProfileUpdateDto {
  @IsString()
  @IsOptional()
  kakaoId?: string;

  @IsString()
  @IsOptional()
  nickname?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  studentId?: string;

  @IsString()
  @IsOptional()
  department?: string;

  @IsNumber()
  @IsOptional()
  dormitoryId?: number;

  @IsString()
  @IsOptional()
  roomNumber?: string;

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @IsBoolean()
  @IsOptional()
  isNewUser?: boolean;
}
