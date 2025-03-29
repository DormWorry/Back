import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoommateProfile } from './entities/roommate-profile.entity';
import { CreateRoommateProfileDto } from './dto/create-roommate-profile.dto';
import { UpdateRoommateProfileDto } from './dto/update-roommate-profile.dto';
import { FilterRoommateProfileDto } from './dto/filter-roommate-profile.dto';

@Injectable()
export class RoommateProfileService {
  constructor(
    @InjectRepository(RoommateProfile)
    private roommateProfileRepository: Repository<RoommateProfile>,
  ) {}

  async create(
    userId: string,
    createRoommateProfileDto: CreateRoommateProfileDto,
  ): Promise<RoommateProfile> {
    const profile = this.roommateProfileRepository.create({
      userId,
      ...createRoommateProfileDto,
    });
    return this.roommateProfileRepository.save(profile);
  }

  async findAll(preferredType?: number): Promise<RoommateProfile[]> {
    const profiles = await this.roommateProfileRepository.find({
      where: { isActive: true },
      relations: [
        'user',
        'myPersonalityType',
        'preferredPersonalityType',
        'dormitory',
      ],
    });

    // 선호 유형이 지정된 경우, 해당 유형을 가진 프로필을 앞으로 정렬
    if (preferredType) {
      return this.sortProfilesByPreferredType(profiles, preferredType);
    }

    return profiles;
  }

  async findWithFilters(
    filters: FilterRoommateProfileDto,
    preferredType?: number,
  ): Promise<RoommateProfile[]> {
    const whereConditions: any = { isActive: true };

    if (filters.myPersonalityTypeId) {
      whereConditions.myPersonalityTypeId = filters.myPersonalityTypeId;
    }

    if (filters.preferredPersonalityTypeId) {
      whereConditions.preferredPersonalityTypeId =
        filters.preferredPersonalityTypeId;
    }

    if (filters.dormitoryId) {
      whereConditions.dormitoryId = filters.dormitoryId;
    }

    const profiles = await this.roommateProfileRepository.find({
      where: whereConditions,
      relations: [
        'user',
        'myPersonalityType',
        'preferredPersonalityType',
        'dormitory',
      ],
    });

    // 선호 유형이 지정된 경우, 해당 유형을 가진 프로필을 앞으로 정렬
    if (preferredType) {
      return this.sortProfilesByPreferredType(profiles, preferredType);
    }

    return profiles;
  }

  // 선호하는 성격 유형을 기준으로 프로필을 정렬하는 헬퍼 메서드
  private sortProfilesByPreferredType(
    profiles: RoommateProfile[],
    preferredType: number,
  ): RoommateProfile[] {
    return profiles.sort((a, b) => {
      // 선호하는 유형을 가진 프로필이 앞으로 오도록 정렬
      if (
        a.myPersonalityTypeId === preferredType &&
        b.myPersonalityTypeId !== preferredType
      ) {
        return -1; // a가 앞으로
      }
      if (
        a.myPersonalityTypeId !== preferredType &&
        b.myPersonalityTypeId === preferredType
      ) {
        return 1; // b가 앞으로
      }
      // 그 외의 경우는 기존 순서 유지
      return 0;
    });
  }

  async findOne(id: string): Promise<RoommateProfile> {
    const profile = await this.roommateProfileRepository.findOne({
      where: { id },
      relations: [
        'user',
        'myPersonalityType',
        'preferredPersonalityType',
        'dormitory',
      ],
    });

    if (!profile) {
      throw new NotFoundException(`Roommate profile with ID ${id} not found`);
    }

    return profile;
  }

  async findByUserId(userId: string): Promise<RoommateProfile> {
    const profile = await this.roommateProfileRepository.findOne({
      where: { userId, isActive: true },
      relations: [
        'user',
        'myPersonalityType',
        'preferredPersonalityType',
        'dormitory',
      ],
    });

    if (!profile) {
      throw new NotFoundException(
        `Roommate profile for user ID ${userId} not found`,
      );
    }

    return profile;
  }

  async update(
    id: string,
    updateRoommateProfileDto: UpdateRoommateProfileDto,
  ): Promise<RoommateProfile> {
    const profile = await this.findOne(id);

    Object.assign(profile, updateRoommateProfileDto);

    return this.roommateProfileRepository.save(profile);
  }

  async remove(id: string): Promise<void> {
    const profile = await this.findOne(id);
    profile.isActive = false;
    await this.roommateProfileRepository.save(profile);
  }
}
