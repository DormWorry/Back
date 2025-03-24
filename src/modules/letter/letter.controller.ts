import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { LetterService } from './letter.service';
import { CreateLetterDto } from './dto/create-letter.dto';

// 추후 인증 가드 추가 구현 필요
// @UseGuards(AuthGuard)
@Controller('letters')
export class LetterController {
  constructor(private readonly letterService: LetterService) {}

  // 받은 편지함 목록 조회
  @Get('received')
  async getReceivedLetters(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    // 추후 실제 인증 처리 후 토큰에서 추출한 사용자 정보 활용
    const userRoomNumber = req.query.roomNumber; // 임시로 쿼리 파라미터로 받음
    return this.letterService.getReceivedLetters(userRoomNumber, page, limit);
  }

  // 보낸 편지함 목록 조회
  @Get('sent')
  async getSentLetters(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    // 추후 실제 인증 처리 후 토큰에서 추출한 사용자 정보 활용
    const userRoomNumber = req.query.roomNumber; // 임시로 쿼리 파라미터로 받음
    return this.letterService.getSentLetters(userRoomNumber, page, limit);
  }

  // 특정 편지 상세 조회
  @Get(':id')
  async getLetterById(
    @Param('id') id: string,
    @Request() req,
  ) {
    // 추후 실제 인증 처리 후 토큰에서 추출한 사용자 정보 활용
    const userRoomNumber = req.query.roomNumber; // 임시로 쿼리 파라미터로 받음
    return this.letterService.getLetterById(id, userRoomNumber);
  }

  // 편지 보내기
  @Post()
  async createLetter(
    @Body() createLetterDto: CreateLetterDto,
  ) {
    return this.letterService.createLetter(createLetterDto);
  }
}
