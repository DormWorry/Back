import { PartialType } from '@nestjs/mapped-types';
import { CreateRoommateProfileDto } from './create-roommate-profile.dto';

export class UpdateRoommateProfileDto extends PartialType(
  CreateRoommateProfileDto,
) {}
