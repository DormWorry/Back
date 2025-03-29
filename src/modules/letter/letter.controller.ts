import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  Patch,
  Delete,
} from '@nestjs/common';
import { LetterService } from './letter.service';
import { CreateLetterDto } from './dto/create-letter.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('letters')
@UseGuards(JwtAuthGuard)
export class LetterController {
  constructor(private readonly letterService: LetterService) {}

  // 받은 편지함 목록 조회
  @Get('received')
  async getReceivedLetters(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const userId = req.user.id;
    return this.letterService.getReceivedLetters(userId, page, limit);
  }

  // 즐겨찾기 편지함 목록 조회
  @Get('favorites')
  async getFavoriteLetters(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const userId = req.user.id;
    return this.letterService.getFavoriteLetters(userId, page, limit);
  }

  // 보낸 편지함 목록 조회
  @Get('sent')
  async getSentLetters(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const userId = req.user.id;
    return this.letterService.getSentLetters(userId, page, limit);
  }

  // 특정 편지 상세 조회
  @Get(':id')
  async getLetterById(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    return this.letterService.getLetterById(id, userId);
  }

  // 편지 보내기
  @Post()
  async createLetter(@Body() createLetterDto: CreateLetterDto, @Request() req) {
    const userId = req.user.id;
    // userId를 DTO에 설정
    createLetterDto.senderUserId = userId;
    return this.letterService.createLetter(createLetterDto);
  }

  // 편지 답장하기
  @Post(':id/reply')
  async replyToLetter(
    @Param('id') id: string,
    @Body() createLetterDto: CreateLetterDto,
    @Request() req,
  ) {
    const userId = req.user.id;
    // userId를 DTO에 설정
    createLetterDto.senderUserId = userId;
    return this.letterService.replyToLetter(id, createLetterDto);
  }

  // 편지 즐겨찾기 설정/해제
  @Patch(':id/favorite')
  async toggleFavorite(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    return this.letterService.toggleFavorite(id, userId);
  }

  // 편지 삭제
  @Delete(':id')
  async deleteLetter(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    return this.letterService.deleteLetter(id, userId);
  }
}
