import { User } from '../../user/entities/user.entity';
import { DormitoryAnnouncement } from '../../dormitory-announcement/entities/dormitory-announcement.entity';
export declare class Dormitory {
    id: number;
    name: string;
    residents: User[];
    announcements: DormitoryAnnouncement[];
}
