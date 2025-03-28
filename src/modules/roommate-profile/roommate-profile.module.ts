import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoommateProfile } from './entities/roommate-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoommateProfile])],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class RoommateProfileModule {}
