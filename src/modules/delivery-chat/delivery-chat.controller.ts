import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { DeliveryChatService } from './delivery-chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequestWithUser } from '../auth/interfaces/request-with-user.interface';

@Controller('delivery-chat')
export class DeliveryChatController {
  constructor(private readonly chatService: DeliveryChatService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':roomId/messages')
  async createMessage(
    @Req() req: RequestWithUser,
    @Param('roomId') roomId: string,
    @Body() messageData: { message: string }
  ) {
    const userId = Number(req.user.id);
    return this.chatService.createMessage(userId, roomId, messageData.message);
  }

  @Get(':roomId')
  async getMessages(@Param('roomId') roomId: string) {
    return this.chatService.getMessages(roomId);
  }
}
