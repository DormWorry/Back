import { PartialType } from '@nestjs/mapped-types';
import { CreateRoommateProfileDto } from './create-roommate-profile.dto';
import { IsOptional, IsBoolean } from 'class-validator';

export class UpdateRoommateProfileDto extends PartialType(CreateRoommateProfileDto) {
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
