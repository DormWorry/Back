import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonalityType } from './entities/personality-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PersonalityType])],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class PersonalityTypeModule {}
