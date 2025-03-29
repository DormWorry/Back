import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dormitory } from '../entities/dormitory.entity';

@Injectable()
export class DormitorySeedService {
  constructor(
    @InjectRepository(Dormitory)
    private dormitoryRepository: Repository<Dormitory>,
  ) {}

  async seed() {
    const count = await this.dormitoryRepository.count();
    
    // 기숙사 데이터가 없는 경우에만 시드 데이터 생성
    if (count === 0) {
      const dormitories = [
        {
          id: 1,
          name: '제 1기숙사',
        },
        {
          id: 2,
          name: '제 2기숙사',
        },
        {
          id: 3,
          name: '제 3기숙사',
        },
      ];

      // 기존 데이터 모두 삭제 (안전하게 초기화)
      await this.dormitoryRepository.clear();
      
      // ID를 직접 지정하기 위해 쿼리 빌더 사용
      for (const dormitory of dormitories) {
        await this.dormitoryRepository
          .createQueryBuilder()
          .insert()
          .into(Dormitory)
          .values(dormitory)
          .execute();
      }
      
      console.log('기숙사 시드 데이터 생성 완료:', dormitories);
      return await this.dormitoryRepository.find();
    }
    
    console.log('기숙사 데이터가 이미 존재합니다. 시드 생성을 건너뜁니다.');
    return await this.dormitoryRepository.find();
  }
}
