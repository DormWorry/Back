import { IsOptional, IsNumber, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class FilterRoommateProfileDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  myPersonalityTypeId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  preferredPersonalityTypeId?: number;

  @IsOptional()
  @IsUUID()
  dormitoryId?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  preferredType?: number;
}
