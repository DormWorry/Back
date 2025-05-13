import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeliveryRoom, DeliveryRoomStatus } from './entities/delivery-room.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class DeliveryRoomService {
  constructor(
    @InjectRepository(DeliveryRoom)
    private readonly deliveryRoomRepository: Repository<DeliveryRoom>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createRoom(userId: number, createRoomDto: CreateRoomDto): Promise<DeliveryRoom> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    const newRoom = this.deliveryRoomRepository.create({
      creatorId: userId.toString(),
      restaurantName: createRoomDto.restaurantName,
      category: createRoomDto.category,
      minimumOrderAmount: createRoomDto.minimumOrderAmount,
      deliveryFee: createRoomDto.deliveryFee,
      description: createRoomDto.description || '',
      status: DeliveryRoomStatus.OPEN,
    });

    return this.deliveryRoomRepository.save(newRoom);
  }

  async getRooms(category?: string): Promise<DeliveryRoom[]> {
    const queryBuilder = this.deliveryRoomRepository
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.participants', 'participants')
      .leftJoinAndSelect('participants.user', 'user')
      .where('room.status = :status', { status: DeliveryRoomStatus.OPEN })
      .orderBy('room.createdAt', 'DESC');

    if (category) {
      queryBuilder.andWhere('room.category = :category', { category });
    }

    return queryBuilder.getMany();
  }

  async getRoomWithParticipants(roomId: string): Promise<DeliveryRoom> {
    const room = await this.deliveryRoomRepository
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.participants', 'participants')
      .leftJoinAndSelect('participants.user', 'user')
      .leftJoinAndSelect('room.creator', 'creator')
      .where('room.id = :roomId', { roomId })
      .getOne();

    if (!room) {
      throw new NotFoundException('주문방을 찾을 수 없습니다.');
    }

    return room;
  }

  async closeRoom(roomId: string, userId: number): Promise<DeliveryRoom> {
    const room = await this.deliveryRoomRepository.findOne({ 
      where: { id: roomId } 
    });

    if (!room) {
      throw new NotFoundException('주문방을 찾을 수 없습니다.');
    }

    if (room.creatorId !== userId.toString()) {
      throw new Error('방장만 주문을 완료할 수 있습니다.');
    }

    room.status = DeliveryRoomStatus.CLOSED;
    room.orderedAt = new Date();

    return this.deliveryRoomRepository.save(room);
  }

  async deleteRoom(roomId: string, userId: number): Promise<void> {
    const room = await this.deliveryRoomRepository.findOne({ 
      where: { id: roomId } 
    });

    if (!room) {
      throw new NotFoundException('주문방을 찾을 수 없습니다.');
    }

    if (room.creatorId !== userId.toString()) {
      throw new Error('방장만 주문방을 삭제할 수 있습니다.');
    }

    await this.deliveryRoomRepository.remove(room);
  }
}
