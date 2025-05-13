import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { DeliveryChatService } from './delivery-chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('delivery-chat')
export class DeliveryChatController {
  constructor(private readonly chatService: DeliveryChatService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':roomId')
  async createMessage(
    @Req() req: Request,
    @Param('roomId') roomId: string,
    @Body() messageData: { message: string }
  ) {
    const userId = req.user['id'];
    return this.chatService.createMessage(userId, roomId, messageData.message);
  }

  @Get(':roomId')
  async getMessages(@Param('roomId') roomId: string) {
    return this.chatService.getMessages(roomId);
  }
}
