import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Letter } from './entities/letter.entity';
import { LetterService } from './letter.service';
import { LetterController } from './letter.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Letter])],
  controllers: [LetterController],
  providers: [LetterService],
  exports: [LetterService],
})
export class LetterModule {}
