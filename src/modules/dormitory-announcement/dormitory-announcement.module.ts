import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DormitoryAnnouncement } from './entities/dormitory-announcement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DormitoryAnnouncement])],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class DormitoryAnnouncementModule {}
