import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { LetterService } from './letter.service';
import { CreateLetterDto } from './dto/create-letter.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

// 요청 객체 타입 정의
interface RequestWithUser extends Request {
  user: {
    id: string;
    kakaoId: string;
    roomNumber: string;
    name?: string;
    nickname?: string;
  };
}

@Controller('letters')
export class LetterController {
  constructor(private readonly letterService: LetterService) {}

  // 받은 편지함 목록 조회
  @UseGuards(AuthGuard('jwt'))
  @Get('received')
  async getReceivedLetters(
    @Req() req: RequestWithUser,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const userRoomNumber = req.user.roomNumber;
    return this.letterService.getReceivedLetters(userRoomNumber, page, limit);
  }

  // 보낸 편지함 목록 조회
  @UseGuards(AuthGuard('jwt'))
  @Get('sent')
  async getSentLetters(
    @Req() req: RequestWithUser,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const userRoomNumber = req.user.roomNumber;
    return this.letterService.getSentLetters(userRoomNumber, page, limit);
  }

  // 특정 편지 상세 조회
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async getLetterById(
    @Param('id') id: string, 
    @Req() req: RequestWithUser,
  ) {
    const userRoomNumber = req.user.roomNumber;
    return this.letterService.getLetterById(id, userRoomNumber);
  }

  // 편지 보내기
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createLetter(
    @Body() createLetterDto: CreateLetterDto,
    @Req() req: RequestWithUser,
  ) {
    // 토큰에서 가져온 사용자 정보로 발신자 정보 설정
    createLetterDto.senderRoomNumber = req.user.roomNumber;
    createLetterDto.senderName = req.user.name || req.user.nickname;
    const senderUserId = req.user.id;
    return this.letterService.createLetter(createLetterDto, senderUserId);
  }
}
