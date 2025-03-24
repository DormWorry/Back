import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dormitory } from './entities/dormitory.entity';
import { DormitorySeedService } from './seed/dormitory.seed';
import { DormitoryController } from './dormitory.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Dormitory])],
  providers: [DormitorySeedService],
  controllers: [DormitoryController],
  exports: [TypeOrmModule],
})
export class DormitoryModule implements OnModuleInit {
  constructor(private readonly dormitorySeedService: DormitorySeedService) {}

  async onModuleInit() {
    // 모듈 초기화 시 시드 데이터 생성
    await this.dormitorySeedService.seed();
  }
}
