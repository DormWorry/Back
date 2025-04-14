import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoommateProfile } from './entities/roommate-profile.entity';
import { PersonalityType } from '../personality-type/entities/personality-type.entity';
import { CreateRoommateProfileDto } from './dto/create-roommate-profile.dto';
import { UpdateRoommateProfileDto } from './dto/update-roommate-profile.dto';

@Injectable()
export class RoommateProfileService {
  constructor(
    @InjectRepository(RoommateProfile)
    private readonly roommateProfileRepository: Repository<RoommateProfile>,
    @InjectRepository(PersonalityType)
    private readonly personalityTypeRepository: Repository<PersonalityType>,
  ) {}

  // 프로필 생성
  async create(
    userId: string,
    createDto: CreateRoommateProfileDto,
  ): Promise<RoommateProfile> {
    // 이미 프로필이 존재하는지 확인
    const existingProfile = await this.roommateProfileRepository.findOne({
      where: { userId },
    });

    if (existingProfile) {
      throw new ConflictException('이미 룸메이트 프로필이 존재합니다.');
    }

    // 선택한 성격 유형이 존재하는지 확인
    await this.validatePersonalityType(createDto.myPersonalityTypeId);
    await this.validatePersonalityType(createDto.preferredPersonalityTypeId);

    // 새 프로필 생성
    const newProfile = this.roommateProfileRepository.create({
      userId,
      ...createDto,
    });

    return this.roommateProfileRepository.save(newProfile);
  }

  // 모든 프로필 조회
  async findAll(options?: {
    isActive?: boolean;
    dormitoryId?: number;
    gender?: string;
    preferredPersonalityTypeId?: number; // 내가 원하는 타입 ID
  }): Promise<RoommateProfile[]> {
    const queryBuilder = this.roommateProfileRepository
      .createQueryBuilder('profile')
      .leftJoinAndSelect('profile.user', 'user')
      .leftJoinAndSelect('profile.myPersonalityType', 'myType')
      .leftJoinAndSelect('profile.preferredPersonalityType', 'preferredType');

    // Active 필터링
    if (options?.isActive !== undefined) {
      queryBuilder.andWhere('profile.isActive = :isActive', {
        isActive: options.isActive,
      });
    }

    // 기숙사 ID로 필터링
    if (options?.dormitoryId) {
      queryBuilder.andWhere('user.dormitoryId = :dormitoryId', {
        dormitoryId: options.dormitoryId,
      });
    }

    // 성별로 필터링
    if (options?.gender) {
      queryBuilder.andWhere('user.gender = :gender', {
        gender: options.gender,
      });
    }

    // 결과 가져오기
    const profiles = await queryBuilder.getMany();

    // 내가 원하는 타입과 일치하는 프로필을 우선적으로 정렬
    if (options?.preferredPersonalityTypeId) {
      return profiles.sort((a, b) => {
        // 내가 원하는 타입과 일치하는지 확인
        const aIsPreferred =
          a.myPersonalityTypeId === options.preferredPersonalityTypeId;
        const bIsPreferred =
          b.myPersonalityTypeId === options.preferredPersonalityTypeId;

        if (aIsPreferred && !bIsPreferred) return -1; // a를 먼저
        if (!aIsPreferred && bIsPreferred) return 1; // b를 먼저
        return 0; // 동일한 경우
      });
    }

    return profiles;
  }

  // 내 성격 유형과 매칭되는 프로필 조회 (나의 preferredPersonalityTypeId와 상대방의 myPersonalityTypeId가 일치)
  async findMatchingProfiles(
    userId: string,
    options?: {
      isActive?: boolean;
      dormitoryId?: number;
      gender?: string;
    },
  ): Promise<RoommateProfile[]> {
    // 내 프로필 조회
    const myProfile = await this.roommateProfileRepository.findOne({
      where: { userId },
    });

    if (!myProfile) {
      throw new NotFoundException(
        '사용자의 룸메이트 프로필을 찾을 수 없습니다.',
      );
    }

    // 내가 선호하는 성격 유형 ID
    const preferredPersonalityTypeId = myProfile.preferredPersonalityTypeId;

    // 모든 프로필을 가져와서 정렬
    return this.findAll({
      ...options,
      preferredPersonalityTypeId,
    });
  }

  // 특정 프로필 조회
  async findOne(profileId: string): Promise<RoommateProfile> {
    const profile = await this.roommateProfileRepository.findOne({
      where: { id: profileId },
      relations: ['user', 'myPersonalityType', 'preferredPersonalityType'],
    });

    if (!profile) {
      throw new NotFoundException('룸메이트 프로필을 찾을 수 없습니다.');
    }

    return profile;
  }

  // 사용자의 프로필 조회
  async findByUserId(userId: string): Promise<RoommateProfile> {
    const profile = await this.roommateProfileRepository.findOne({
      where: { userId },
      relations: ['user', 'myPersonalityType', 'preferredPersonalityType'],
    });

    if (!profile) {
      throw new NotFoundException('룸메이트 프로필을 찾을 수 없습니다.');
    }

    return profile;
  }

  // 프로필 업데이트
  async update(
    userId: string,
    updateDto: UpdateRoommateProfileDto,
  ): Promise<RoommateProfile> {
    // 프로필 존재 여부 확인
    const profile = await this.roommateProfileRepository.findOne({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('룸메이트 프로필을 찾을 수 없습니다.');
    }

    // 성격 유형 ID가 변경되는 경우 유효성 검사
    if (updateDto.myPersonalityTypeId) {
      await this.validatePersonalityType(updateDto.myPersonalityTypeId);
    }

    if (updateDto.preferredPersonalityTypeId) {
      await this.validatePersonalityType(updateDto.preferredPersonalityTypeId);
    }

    // 프로필 업데이트
    Object.assign(profile, updateDto);
    return this.roommateProfileRepository.save(profile);
  }

  // 프로필 삭제
  async remove(userId: string): Promise<void> {
    const profile = await this.roommateProfileRepository.findOne({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('룸메이트 프로필을 찾을 수 없습니다.');
    }

    await this.roommateProfileRepository.remove(profile);
  }

  // 성격 유형 ID 유효성 검사
  private async validatePersonalityType(typeId: number): Promise<void> {
    const personalityType = await this.personalityTypeRepository.findOne({
      where: { id: typeId },
    });

    if (!personalityType) {
      throw new NotFoundException(
        `ID가 ${typeId}인 성격 유형을 찾을 수 없습니다.`,
      );
    }
  }
}
