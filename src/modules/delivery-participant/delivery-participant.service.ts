import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeliveryParticipant } from './entities/delivery-participant.entity';
import { DeliveryRoom } from '../delivery-room/entities/delivery-room.entity';
import { User } from '../user/entities/user.entity';

interface JoinRoomParams {
  userId: number;
  deliveryRoomId: string;
  orderDetails?: string;
  amount?: number;
}

@Injectable()
export class DeliveryParticipantService {
  constructor(
    @InjectRepository(DeliveryParticipant)
    private readonly participantRepository: Repository<DeliveryParticipant>,
    @InjectRepository(DeliveryRoom)
    private readonly roomRepository: Repository<DeliveryRoom>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async joinRoom(params: JoinRoomParams): Promise<DeliveryParticipant> {
    const { userId, deliveryRoomId, orderDetails, amount } = params;

    // 방이 존재하는지 확인
    const room = await this.roomRepository.findOne({ 
      where: { id: deliveryRoomId } 
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

    // 이미 참여중인지 확인
    const existingParticipant = await this.participantRepository.findOne({
      where: {
        userId: userId.toString(),
        deliveryRoomId,
      }
    });

    if (existingParticipant) {
      // 이미 참여 중이라면 409 오류 대신 기존 참여 정보 반환
      console.log(`사용자 ${userId}는 이미 방 ${deliveryRoomId}에 참여 중입니다.`);
      return existingParticipant;
    }

    // 새로운 참여자 생성
    const newParticipant = this.participantRepository.create({
      userId: userId.toString(),
      deliveryRoomId,
      orderDetails: orderDetails || '',
      amount: amount || 0,
      isPaid: false,
    });

    return this.participantRepository.save(newParticipant);
  }

  async leaveRoom(userId: number, roomId: string): Promise<void> {
    const participant = await this.participantRepository.findOne({
      where: {
        userId: userId.toString(),
        deliveryRoomId: roomId,
      }
    });

    if (!participant) {
      throw new NotFoundException('참여 정보를 찾을 수 없습니다.');
    }

    // 참여자 삭제
    await this.participantRepository.remove(participant);
  }

  async updateOrderDetails(
    userId: number,
    roomId: string,
    orderDetails: string,
    amount: number,
  ): Promise<DeliveryParticipant> {
    const participant = await this.participantRepository.findOne({
      where: {
        userId: userId.toString(),
        deliveryRoomId: roomId,
      }
    });

    if (!participant) {
      throw new NotFoundException('참여 정보를 찾을 수 없습니다.');
    }

    participant.orderDetails = orderDetails;
    participant.amount = amount;

    return this.participantRepository.save(participant);
  }

  async getRoomParticipants(roomId: string): Promise<DeliveryParticipant[]> {
    return this.participantRepository.find({
      where: { deliveryRoomId: roomId },
      relations: ['user'],
    });
  }

  async markAsPaid(userId: number, roomId: string): Promise<DeliveryParticipant> {
    const participant = await this.participantRepository.findOne({
      where: {
        userId: userId.toString(),
        deliveryRoomId: roomId,
      }
    });

    if (!participant) {
      throw new NotFoundException('참여 정보를 찾을 수 없습니다.');
    }

    participant.isPaid = true;

    return this.participantRepository.save(participant);
  }
}
