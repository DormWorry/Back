import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { PersonalityType } from '../../personality-type/entities/personality-type.entity';

@Entity()
export class RoommateProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  myPersonalityTypeId: number;

  @Column()
  preferredPersonalityTypeId: number;

  @Column()
  kakaoTalkId: string;

  @Column()
  instagramId: string;

  @Column('text')
  introduction: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => PersonalityType)
  @JoinColumn({ name: 'myPersonalityTypeId' })
  myPersonalityType: PersonalityType;

  @ManyToOne(() => PersonalityType)
  @JoinColumn({ name: 'preferredPersonalityTypeId' })
  preferredPersonalityType: PersonalityType;
}
