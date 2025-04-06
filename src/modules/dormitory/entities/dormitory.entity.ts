import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  BeforeInsert,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../user/entities/user.entity';
import { DormitoryAnnouncement } from '../../dormitory-announcement/entities/dormitory-announcement.entity';

@Entity()
export class Dormitory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }

  @Column()
  name: string;

  @Column()
  location: string;

  @Column('text')
  description: string;

  // Relations
  @OneToMany(() => User, (user) => user.dormitory)
  residents: User[];

  @OneToMany(
    () => DormitoryAnnouncement,
    (announcement) => announcement.dormitory,
  )
  announcements: DormitoryAnnouncement[];
}
