import { 
  Body, 
  Controller, 
  Get, 
  Param, 
  Post, 
  Query, 
  UseGuards, 
  Logger 
} from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { JwtAuthGuard } from '../modules/auth/guards/jwt-auth.guard';

@Controller('api/firebase')
export class FirebaseController {
  private readonly logger = new Logger(FirebaseController.name);

  constructor(private readonly firebaseService: FirebaseService) {}

  @UseGuards(JwtAuthGuard)
  @Post('rooms/:roomId/messages')
  async sendMessage(
    @Param('roomId') roomId: string,
    @Body() messageData: any
  ) {
    this.logger.log(`메시지 전송 요청 - 방 ID: ${roomId}`);
    
    // 방이 존재하는지 확인하고 없으면 생성
    await this.firebaseService.ensureRoomExists(roomId);
    
    // 메시지 저장 및 반환
    return this.firebaseService.saveMessage(roomId, messageData);
  }

  @UseGuards(JwtAuthGuard)
  @Get('rooms/:roomId/messages')
  async getMessages(
    @Param('roomId') roomId: string,
    @Query('limit') limit: number
  ) {
    this.logger.log(`메시지 조회 요청 - 방 ID: ${roomId}, 제한: ${limit || 100}`);
    return this.firebaseService.getMessages(roomId, limit);
  }

  @UseGuards(JwtAuthGuard)
  @Post('rooms/:roomId/join')
  async joinRoom(
    @Param('roomId') roomId: string,
    @Body() userData: any
  ) {
    this.logger.log(`방 참여 요청 - 방 ID: ${roomId}, 사용자 ID: ${userData.id}`);
    
    // 방이 존재하는지 확인하고 없으면 생성
    await this.firebaseService.ensureRoomExists(roomId);
    
    // 참여자 등록
    const result = await this.firebaseService.joinRoom(roomId, userData);
    return { success: result };
  }

  @UseGuards(JwtAuthGuard)
  @Post('rooms/:roomId/leave')
  async leaveRoom(
    @Param('roomId') roomId: string,
    @Body() body: { userId: string }
  ) {
    this.logger.log(`방 나가기 요청 - 방 ID: ${roomId}, 사용자 ID: ${body.userId}`);
    const result = await this.firebaseService.leaveRoom(roomId, body.userId);
    return { success: result };
  }

  @UseGuards(JwtAuthGuard)
  @Get('rooms/:roomId/participants')
  async getRoomParticipants(
    @Param('roomId') roomId: string
  ) {
    this.logger.log(`참여자 목록 조회 요청 - 방 ID: ${roomId}`);
    return this.firebaseService.getRoomParticipants(roomId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('rooms/:roomId')
  async getRoomInfo(
    @Param('roomId') roomId: string
  ) {
    this.logger.log(`채팅방 정보 조회 요청 - 방 ID: ${roomId}`);
    return this.firebaseService.ensureRoomExists(roomId);
  }
}
