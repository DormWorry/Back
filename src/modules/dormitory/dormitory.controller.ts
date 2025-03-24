import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dormitory } from './entities/dormitory.entity';

@Controller('dormitories')
export class DormitoryController {
  constructor(
    @InjectRepository(Dormitory)
    private dormitoryRepository: Repository<Dormitory>,
  ) {}

  @Get()
  async getAllDormitories() {
    const dormitories = await this.dormitoryRepository.find();
    return { dormitories };
  }
}
