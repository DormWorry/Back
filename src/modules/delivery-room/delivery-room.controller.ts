import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  Patch,
} from '@nestjs/common';
import { DeliveryRoomService } from './delivery-room.service';
import { CreateDeliveryRoomDto } from './dto/create-delivery-room.dto';
import { FilterDeliveryRoomDto } from './dto/filter-delivery-room.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DeliveryRoomStatus } from './entities/delivery-room.entity';

@Controller('delivery-rooms')
@UseGuards(JwtAuthGuard)
export class DeliveryRoomController {
  constructor(private readonly deliveryRoomService: DeliveryRoomService) {}

  // 배달 방 생성
  @Post()
  create(@Request() req, @Body() createDeliveryRoomDto: CreateDeliveryRoomDto) {
    return this.deliveryRoomService.create(req.user.id, createDeliveryRoomDto);
  }

  // 모든 배달 방 조회 (필터링 가능)
  @Get()
  findAll(@Query() filterDto: FilterDeliveryRoomDto) {
    return this.deliveryRoomService.findAll(filterDto);
  }

  // 카테고리별 배달 방 조회
  @Get('categories/:category')
  findByCategory(@Param('category') category: string) {
    return this.deliveryRoomService.findByCategory(category);
  }

  // 카테고리 목록 조회
  @Get('categories')
  getAllCategories() {
    return this.deliveryRoomService.getAllCategories();
  }

  // 내가 생성한 배달 방 조회
  @Get('my-rooms')
  findMyRooms(@Request() req) {
    return this.deliveryRoomService.findByCreator(req.user.id);
  }

  // 내가 참여중인 배달 방 조회
  @Get('participating')
  findParticipatingRooms(@Request() req) {
    return this.deliveryRoomService.findByParticipant(req.user.id);
  }

  // 특정 배달 방 조회
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deliveryRoomService.findOne(id);
  }

  // 배달 방 상태 변경
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: DeliveryRoomStatus,
    @Request() req,
  ) {
    return this.deliveryRoomService.updateStatus(id, req.user.id, status);
  }

  // 배달 방 삭제
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.deliveryRoomService.remove(id, req.user.id);
  }
}
