import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoommateProfile } from './entities/roommate-profile.entity';
import { CreateRoommateProfileDto } from './dto/create-roommate-profile.dto';
import { UpdateRoommateProfileDto } from './dto/update-roommate-profile.dto';

interface FindAllOptions {
  myPersonalityTypeId?: number;
  preferredPersonalityTypeId?: number;
  dormitoryId?: string;
}

@Injectable()
export class RoommateProfileService {
  constructor(
    @InjectRepository(RoommateProfile)
    private roommateProfileRepository: Repository<RoommateProfile>,
  ) {}

  async create(userId: string, createRoommateProfileDto: CreateRoommateProfileDto) {
    // 이미 프로필이 존재하는지 확인
    const existingProfile = await this.roommateProfileRepository.findOne({
      where: { userId },
    });

    if (existingProfile) {
      // 기존 프로필이 있으면 업데이트
      return this.update(existingProfile.id, createRoommateProfileDto);
    }

    // 새 프로필 생성
    const profile = this.roommateProfileRepository.create({
      userId,
      myPersonalityTypeId: createRoommateProfileDto.myPersonalityTypeId,
      preferredPersonalityTypeId: createRoommateProfileDto.preferredPersonalityTypeId,
      kakaoTalkId: createRoommateProfileDto.kakaoTalkId,
      instagramId: createRoommateProfileDto.instagramId,
      introduction: createRoommateProfileDto.introduction,
      dormitoryId: createRoommateProfileDto.dormitoryId,
    });

    return this.roommateProfileRepository.save(profile);
  }

  async findAll(options?: FindAllOptions) {
    const queryBuilder = this.roommateProfileRepository
      .createQueryBuilder('profile')
      .leftJoinAndSelect('profile.user', 'user')
      .leftJoinAndSelect('profile.myPersonalityType', 'myType')
      .leftJoinAndSelect('profile.preferredPersonalityType', 'preferredType');

    // 필터 적용
    if (options?.myPersonalityTypeId) {
      queryBuilder.andWhere('profile.myPersonalityTypeId = :myTypeId', {
        myTypeId: options.myPersonalityTypeId,
      });
    }

    if (options?.preferredPersonalityTypeId) {
      queryBuilder.andWhere('profile.preferredPersonalityTypeId = :preferredTypeId', {
        preferredTypeId: options.preferredPersonalityTypeId,
      });
    }

    if (options?.dormitoryId) {
      queryBuilder.andWhere('profile.dormitoryId = :dormitoryId', {
        dormitoryId: options.dormitoryId,
      });
    }

    // 매칭 알고리즘: 상호 매칭이 가능한 프로필을 우선적으로 보여줌
    // 예: 내가 A 유형이고 B 유형을 찾는다면, B 유형이면서 A 유형을 찾는 사람을 우선 보여줌
    if (options?.myPersonalityTypeId && options?.preferredPersonalityTypeId) {
      queryBuilder.addOrderBy(
        `CASE 
          WHEN profile.myPersonalityTypeId = :preferredTypeId AND 
               profile.preferredPersonalityTypeId = :myTypeId 
          THEN 0 
          ELSE 1 
         END`,
        'ASC',
      );
      
      queryBuilder.setParameters({
        myTypeId: options.myPersonalityTypeId,
        preferredTypeId: options.preferredPersonalityTypeId,
      });
    }

    queryBuilder.addOrderBy('profile.updatedAt', 'DESC');

    return queryBuilder.getMany();
  }

  async findOne(id: string) {
    const profile = await this.roommateProfileRepository.findOne({
      where: { id },
      relations: ['user', 'myPersonalityType', 'preferredPersonalityType'],
    });
    
    if (!profile) {
      throw new NotFoundException(`Profile with ID "${id}" not found`);
    }
    
    return profile;
  }

  async findByUserId(userId: string) {
    return this.roommateProfileRepository.findOne({
      where: { userId },
      relations: ['user', 'myPersonalityType', 'preferredPersonalityType'],
    });
  }

  async update(id: string, updateRoommateProfileDto: UpdateRoommateProfileDto) {
    const profile = await this.findOne(id);
    
    // 업데이트할 필드 적용
    Object.assign(profile, updateRoommateProfileDto);
    
    return this.roommateProfileRepository.save(profile);
  }

  async remove(id: string) {
    const profile = await this.findOne(id);
    await this.roommateProfileRepository.remove(profile);
    return { id };
  }
}
