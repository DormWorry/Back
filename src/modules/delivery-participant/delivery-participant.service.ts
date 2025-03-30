import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeliveryParticipant } from './entities/delivery-participant.entity';
import {
  DeliveryRoom,
  DeliveryRoomStatus,
} from '../delivery-room/entities/delivery-room.entity';
import { CreateDeliveryParticipantDto } from './dto/create-delivery-participant.dto';

@Injectable()
export class DeliveryParticipantService {
  constructor(
    @InjectRepository(DeliveryParticipant)
    private participantRepository: Repository<DeliveryParticipant>,
    @InjectRepository(DeliveryRoom)
    private deliveryRoomRepository: Repository<DeliveryRoom>,
  ) {}

  // 배달 참가자 추가
  async join(
    userId: string,
    createDto: CreateDeliveryParticipantDto,
  ): Promise<DeliveryParticipant> {
    // 방이 존재하는지 확인
    const room = await this.deliveryRoomRepository.findOne({
      where: { id: createDto.deliveryRoomId },
      relations: ['participants'],
    });

    if (!room) {
      throw new NotFoundException('배달 방을 찾을 수 없습니다.');
    }

    // 방이 열려있는지 확인
    if (room.status !== DeliveryRoomStatus.OPEN) {
      throw new BadRequestException('이미 닫혔거나 완료된 배달 방입니다.');
    }

    // 이미 참여중인지 확인
    const existingParticipant = room.participants.find(
      (p) => p.userId === userId,
    );
    if (existingParticipant) {
      throw new BadRequestException('이미 해당 배달 방에 참여하고 있습니다.');
    }

    // 참가자 생성
    const participant = this.participantRepository.create({
      userId,
      ...createDto,
    });

    return this.participantRepository.save(participant);
  }

  // 특정 방의 모든 참가자 조회
  async findAllByRoomId(roomId: string): Promise<DeliveryParticipant[]> {
    return this.participantRepository.find({
      where: { deliveryRoomId: roomId },
      relations: ['user'],
    });
  }

  // 특정 참가자 조회
  async findOne(id: string): Promise<DeliveryParticipant> {
    const participant = await this.participantRepository.findOne({
      where: { id },
      relations: ['user', 'deliveryRoom'],
    });

    if (!participant) {
      throw new NotFoundException('참가자 정보를 찾을 수 없습니다.');
    }

    return participant;
  }

  // 참가자 정보 수정 (주문 내용, 금액 등)
  async update(
    id: string,
    userId: string,
    updateData: Partial<DeliveryParticipant>,
  ): Promise<DeliveryParticipant> {
    const participant = await this.findOne(id);

    // 본인만 수정 가능
    if (participant.userId !== userId) {
      throw new ForbiddenException('해당 주문 정보를 수정할 권한이 없습니다.');
    }

    // 방이 아직 열려있는지 확인
    if (participant.deliveryRoom.status !== DeliveryRoomStatus.OPEN) {
      throw new BadRequestException(
        '이미 주문 완료된 배달 방의 정보는 수정할 수 없습니다.',
      );
    }

    Object.assign(participant, updateData);

    return this.participantRepository.save(participant);
  }

  // 참가자 삭제 (방 나가기)
  async remove(id: string, userId: string): Promise<void> {
    const participant = await this.findOne(id);

    // 본인만 삭제 가능
    if (participant.userId !== userId) {
      throw new ForbiddenException('해당 주문 정보를 삭제할 권한이 없습니다.');
    }

    // 방이 아직 열려있는지 확인
    if (participant.deliveryRoom.status !== DeliveryRoomStatus.OPEN) {
      throw new BadRequestException(
        '이미 주문 완료된 배달 방에서는 나갈 수 없습니다.',
      );
    }

    await this.participantRepository.remove(participant);
  }

  // 결제 상태 토글
  async togglePaymentStatus(
    id: string,
    userId: string,
  ): Promise<DeliveryParticipant> {
    const participant = await this.findOne(id);

    // 본인만 수정 가능 (방장에게도 권한 부여 가능)
    if (
      participant.userId !== userId &&
      participant.deliveryRoom.creatorId !== userId
    ) {
      throw new ForbiddenException('결제 상태를 변경할 권한이 없습니다.');
    }

    participant.isPaid = !participant.isPaid;

    return this.participantRepository.save(participant);
  }
}
