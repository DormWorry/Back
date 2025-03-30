import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  Patch,
} from '@nestjs/common';
import { DeliveryParticipantService } from './delivery-participant.service';
import { CreateDeliveryParticipantDto } from './dto/create-delivery-participant.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('delivery-participants')
@UseGuards(JwtAuthGuard)
export class DeliveryParticipantController {
  constructor(
    private readonly participantService: DeliveryParticipantService,
  ) {}

  // 배달 방 참가
  @Post()
  join(@Request() req, @Body() createDto: CreateDeliveryParticipantDto) {
    return this.participantService.join(req.user.id, createDto);
  }

  // 특정 방의 모든 참가자 조회
  @Get('room/:roomId')
  findAllByRoomId(@Param('roomId') roomId: string) {
    return this.participantService.findAllByRoomId(roomId);
  }

  // 특정 참가자 조회
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.participantService.findOne(id);
  }

  // 참가자 정보 수정
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateData: Partial<any>,
    @Request() req,
  ) {
    return this.participantService.update(id, req.user.id, updateData);
  }

  // 참가자 결제 상태 토글
  @Patch(':id/payment')
  togglePaymentStatus(@Param('id') id: string, @Request() req) {
    return this.participantService.togglePaymentStatus(id, req.user.id);
  }

  // 배달 방 나가기
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.participantService.remove(id, req.user.id);
  }
}
