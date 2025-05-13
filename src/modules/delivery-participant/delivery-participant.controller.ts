import { Controller, Post, Body, Patch, Delete, Param, UseGuards, Req } from '@nestjs/common';
import { DeliveryParticipantService } from './delivery-participant.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequestWithUser } from '../auth/interfaces/request-with-user.interface';

@Controller('delivery-participant')
export class DeliveryParticipantController {
  constructor(private readonly participantService: DeliveryParticipantService) {}

  @UseGuards(JwtAuthGuard)
  @Post('join')
  async joinRoom(@Req() req: RequestWithUser, @Body() joinData: { deliveryRoomId: string, orderDetails?: string, amount?: number }) {
    const userId = Number(req.user.id);
    return this.participantService.joinRoom({
      userId,
      deliveryRoomId: joinData.deliveryRoomId,
      orderDetails: joinData.orderDetails || '',
      amount: joinData.amount || 0
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':roomId/leave')
  async leaveRoom(@Req() req: RequestWithUser, @Param('roomId') roomId: string) {
    const userId = Number(req.user.id);
    await this.participantService.leaveRoom(userId, roomId);
    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':roomId/update-order')
  async updateOrderDetails(
    @Req() req: RequestWithUser,
    @Param('roomId') roomId: string,
    @Body() updateData: { orderDetails: string, amount: number }
  ) {
    const userId = Number(req.user.id);
    return this.participantService.updateOrderDetails(
      userId,
      roomId,
      updateData.orderDetails,
      updateData.amount
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':roomId/mark-paid')
  async markAsPaid(@Req() req: RequestWithUser, @Param('roomId') roomId: string) {
    const userId = Number(req.user.id);
    return this.participantService.markAsPaid(userId, roomId);
  }
}
