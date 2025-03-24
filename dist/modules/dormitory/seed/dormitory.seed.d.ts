import { Repository } from 'typeorm';
import { Dormitory } from '../entities/dormitory.entity';
export declare class DormitorySeedService {
    private dormitoryRepository;
    constructor(dormitoryRepository: Repository<Dormitory>);
    seed(): Promise<Dormitory[]>;
}
