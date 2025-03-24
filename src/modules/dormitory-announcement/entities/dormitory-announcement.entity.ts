import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Dormitory } from '../../dormitory/entities/dormitory.entity';

@Entity()
export class DormitoryAnnouncement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  dormitoryId: string;

  @Column()
  category: string;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column()
  publishedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Dormitory, (dormitory) => dormitory.announcements)
  @JoinColumn({ name: 'dormitoryId' })
  dormitory: Dormitory;
}
