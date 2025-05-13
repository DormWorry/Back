import { Controller, Get, Post, Body, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { DeliveryRoomService } from './delivery-room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('delivery-room')
export class DeliveryRoomController {
  constructor(private readonly deliveryRoomService: DeliveryRoomService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createRoom(@Req() req: Request, @Body() createRoomDto: CreateRoomDto) {
    const userId = req.user['id'];
    return this.deliveryRoomService.createRoom(userId, createRoomDto);
  }

  @Get()
  async getRooms(@Query('category') category?: string) {
    return this.deliveryRoomService.getRooms(category);
  }

  @Get(':id')
  async getRoom(@Param('id') id: string) {
    return this.deliveryRoomService.getRoomWithParticipants(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/close')
  async closeRoom(@Req() req: Request, @Param('id') id: string) {
    const userId = req.user['id'];
    return this.deliveryRoomService.closeRoom(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteRoom(@Req() req: Request, @Param('id') id: string) {
    const userId = req.user['id'];
    await this.deliveryRoomService.deleteRoom(id, userId);
    return { success: true };
  }
}
