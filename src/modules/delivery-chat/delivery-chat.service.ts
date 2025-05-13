import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeliveryChat } from './entities/delivery-chat.entity';
import { DeliveryRoom } from '../delivery-room/entities/delivery-room.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class DeliveryChatService {
  constructor(
    @InjectRepository(DeliveryChat)
    private readonly chatRepository: Repository<DeliveryChat>,
    @InjectRepository(DeliveryRoom)
    private readonly roomRepository: Repository<DeliveryRoom>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createMessage(userId: number, roomId: string, message: string): Promise<DeliveryChat> {
    // 방이 존재하는지 확인
    const room = await this.roomRepository.findOne({ 
      where: { id: roomId } 
    });
    
    if (!room) {
      throw new NotFoundException('주문방을 찾을 수 없습니다.');
    }

    // 유저가 존재하는지 확인
    const user = await this.userRepository.findOne({ 
      where: { id: userId } 
    });
    
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    // 새 메시지 생성
    const newMessage = this.chatRepository.create({
      userId: userId.toString(),
      deliveryRoomId: roomId,
      message,
    });

    const savedMessage = await this.chatRepository.save(newMessage);

    // 사용자 정보를 포함한 메시지 반환
    return {
      ...savedMessage,
      user,
    } as DeliveryChat;
  }

  async getMessages(roomId: string): Promise<DeliveryChat[]> {
    // 방이 존재하는지 확인
    const room = await this.roomRepository.findOne({ 
      where: { id: roomId } 
    });
    
    if (!room) {
      throw new NotFoundException('주문방을 찾을 수 없습니다.');
    }

    // 메시지 가져오기 (최신순으로 정렬하고 100개만)
    return this.chatRepository.find({
      where: { deliveryRoomId: roomId },
      relations: ['user'],
      order: { createdAt: 'ASC' },
      take: 100,
    });
  }
}
