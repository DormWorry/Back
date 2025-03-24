import { OnModuleInit } from '@nestjs/common';
import { DormitorySeedService } from './seed/dormitory.seed';
export declare class DormitoryModule implements OnModuleInit {
    private readonly dormitorySeedService;
    constructor(dormitorySeedService: DormitorySeedService);
    onModuleInit(): Promise<void>;
}
