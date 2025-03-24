import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { DormitoryAnnouncement } from '../../dormitory-announcement/entities/dormitory-announcement.entity';

@Entity()
export class Dormitory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  location: string;

  @Column('text')
  description: string;

  // Relations
  @OneToMany(() => User, (user) => user.dormitory)
  residents: User[];

  @OneToMany(() => DormitoryAnnouncement, (announcement) => announcement.dormitory)
  announcements: DormitoryAnnouncement[];
}
