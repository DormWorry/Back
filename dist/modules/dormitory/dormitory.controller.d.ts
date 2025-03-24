import { Repository } from 'typeorm';
import { Dormitory } from './entities/dormitory.entity';
export declare class DormitoryController {
    private dormitoryRepository;
    constructor(dormitoryRepository: Repository<Dormitory>);
    getAllDormitories(): Promise<{
        dormitories: Dormitory[];
    }>;
}
