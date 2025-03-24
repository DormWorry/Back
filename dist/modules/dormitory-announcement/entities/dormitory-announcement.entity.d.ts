import { Dormitory } from '../../dormitory/entities/dormitory.entity';
export declare class DormitoryAnnouncement {
    id: string;
    dormitoryId: string;
    category: string;
    title: string;
    content: string;
    publishedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    dormitory: Dormitory;
}
