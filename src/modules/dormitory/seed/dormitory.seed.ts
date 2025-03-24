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
          name: '기숙사 A동',
          location: '서울특별시 성북구 화랑로 123',
          description: '남학생 전용 기숙사, 2인실 위주',
        },
        {
          name: '기숙사 B동',
          location: '서울특별시 성북구 화랑로 124',
          description: '여학생 전용 기숙사, 2인실 위주',
        },
        {
          name: '기숙사 C동',
          location: '서울특별시 성북구 화랑로 125',
          description: '대학원생 전용 기숙사, 1인실 위주',
        },
      ];

      const createdDormitories = this.dormitoryRepository.create(dormitories);
      const savedDormitories = await this.dormitoryRepository.save(createdDormitories);
      
      console.log('기숙사 시드 데이터 생성 완료:', savedDormitories.map(d => ({ id: d.id, name: d.name })));
      return savedDormitories;
    }
    
    console.log('기숙사 데이터가 이미 존재합니다. 시드 생성을 건너뜁니다.');
    return await this.dormitoryRepository.find();
  }
}
