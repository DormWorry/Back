import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Letter } from './entities/letter.entity';
import { LetterService } from './letter.service';
import { LetterController } from './letter.controller';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Letter, User])],
  controllers: [LetterController],
  providers: [LetterService],
  exports: [LetterService],
})
export class LetterModule {}
