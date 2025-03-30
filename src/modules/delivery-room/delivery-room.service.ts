import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  DeliveryRoom,
  DeliveryRoomStatus,
} from './entities/delivery-room.entity';
import { CreateDeliveryRoomDto } from './dto/create-delivery-room.dto';
import { FilterDeliveryRoomDto } from './dto/filter-delivery-room.dto';
import { FoodCategory } from './constants/category.constants';

@Injectable()
export class DeliveryRoomService {
  constructor(
    @InjectRepository(DeliveryRoom)
    private deliveryRoomRepository: Repository<DeliveryRoom>,
  ) {}

  // 배달 방 생성
  async create(
    userId: string,
    createDeliveryRoomDto: CreateDeliveryRoomDto,
  ): Promise<DeliveryRoom> {
    const room = this.deliveryRoomRepository.create({
      creatorId: userId,
      ...createDeliveryRoomDto,
    });
    return this.deliveryRoomRepository.save(room);
  }

  // 모든 배달 방 조회 (필터링 가능)
  async findAll(filters: FilterDeliveryRoomDto = {}): Promise<DeliveryRoom[]> {
    const whereConditions: any = {};

    if (filters.category) {
      whereConditions.category = filters.category;
    }

    if (filters.status) {
      whereConditions.status = filters.status;
    } else {
      // 기본적으로 열린 방만 조회
      whereConditions.status = DeliveryRoomStatus.OPEN;
    }

    return this.deliveryRoomRepository.find({
      where: whereConditions,
      relations: ['creator', 'participants'],
      order: { createdAt: 'DESC' },
    });
  }

  // 카테고리별 배달 방 조회
  async findByCategory(category: string): Promise<DeliveryRoom[]> {
    return this.deliveryRoomRepository.find({
      where: {
        category,
        status: DeliveryRoomStatus.OPEN,
      },
      relations: ['creator', 'participants'],
      order: { createdAt: 'DESC' },
    });
  }

  // 사용자가 생성한 배달 방 조회
  async findByCreator(userId: string): Promise<DeliveryRoom[]> {
    return this.deliveryRoomRepository.find({
      where: { creatorId: userId },
      relations: ['creator', 'participants'],
      order: { createdAt: 'DESC' },
    });
  }

  // 사용자가 참여중인 배달 방 조회
  async findByParticipant(userId: string): Promise<DeliveryRoom[]> {
    return this.deliveryRoomRepository
      .createQueryBuilder('room')
      .innerJoinAndSelect(
        'room.participants',
        'participant',
        'participant.userId = :userId',
        { userId },
      )
      .leftJoinAndSelect('room.creator', 'creator')
      .leftJoinAndSelect('room.participants', 'allParticipants')
      .orderBy('room.createdAt', 'DESC')
      .getMany();
  }

  // 특정 배달 방 조회
  async findOne(id: string): Promise<DeliveryRoom> {
    const room = await this.deliveryRoomRepository.findOne({
      where: { id },
      relations: ['creator', 'participants', 'participants.user'],
    });

    if (!room) {
      throw new NotFoundException(`배달 방 ID ${id}를 찾을 수 없습니다.`);
    }

    return room;
  }

  // 배달 방 상태 변경 (주문 완료 등)
  async updateStatus(
    id: string,
    userId: string,
    status: DeliveryRoomStatus,
  ): Promise<DeliveryRoom> {
    const room = await this.findOne(id);

    // 방 생성자만 상태 변경 가능
    if (room.creatorId !== userId) {
      throw new ForbiddenException('방 상태를 변경할 권한이 없습니다.');
    }

    room.status = status;

    // 완료 상태로 변경 시 주문 시간 기록
    if (status === DeliveryRoomStatus.COMPLETED) {
      room.orderedAt = new Date();
    }

    return this.deliveryRoomRepository.save(room);
  }

  // 배달 방 삭제
  async remove(id: string, userId: string): Promise<void> {
    const room = await this.findOne(id);

    // 방 생성자만 삭제 가능
    if (room.creatorId !== userId) {
      throw new ForbiddenException('방을 삭제할 권한이 없습니다.');
    }

    await this.deliveryRoomRepository.remove(room);
  }

  // 모든 카테고리 목록 조회
  getAllCategories(): { key: string; name: string }[] {
    return Object.entries(FoodCategory).map(([key, value]) => ({
      key,
      name: value,
    }));
  }
}
