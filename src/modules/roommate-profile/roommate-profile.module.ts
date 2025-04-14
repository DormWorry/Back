import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoommateProfile } from './entities/roommate-profile.entity';
import { PersonalityType } from '../personality-type/entities/personality-type.entity';
import { RoommateProfileController } from './roommate-profile.controller';
import { RoommateProfileService } from './roommate-profile.service';

@Module({
  imports: [TypeOrmModule.forFeature([RoommateProfile, PersonalityType])],
  controllers: [RoommateProfileController],
  providers: [RoommateProfileService],
  exports: [TypeOrmModule, RoommateProfileService],
})
export class RoommateProfileModule {}
