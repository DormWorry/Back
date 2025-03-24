import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Dormitory } from '../../dormitory/entities/dormitory.entity';
import { Letter } from '../../letter/entities/letter.entity';
import { DeliveryRoom } from '../../delivery-room/entities/delivery-room.entity';
import { DeliveryParticipant } from '../../delivery-participant/entities/delivery-participant.entity';
import { DeliveryChat } from '../../delivery-chat/entities/delivery-chat.entity';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

// 기숙사 타입을 상수로 정의 (enum 대신)
export const DORMITORY_TYPES = {
  DORM1: '제 1기숙사',
  DORM2: '제 2기숙사',
  DORM3: '제 3기숙사',
};

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: true, unique: true })
  kakaoId: string;

  @Column()
  nickname: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  studentId: string;

  @Column({ nullable: true })
  department: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  dormitoryId: string;

  @Column({ nullable: true })
  roomNumber: string;

  @Column({
    type: 'enum',
    enum: Gender,
    nullable: true,
  })
  gender: Gender;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: true })
  isNewUser: boolean;

  // Relations
  @ManyToOne(() => Dormitory)
  @JoinColumn({ name: 'dormitoryId' })
  dormitory: Dormitory;

  @OneToMany(() => Letter, (letter) => letter.sender)
  sentLetters: Letter[];

  @OneToMany(() => Letter, (letter) => letter.recipient)
  receivedLetters: Letter[];

  @OneToMany(() => DeliveryRoom, (deliveryRoom) => deliveryRoom.creator)
  createdDeliveryRooms: DeliveryRoom[];

  @OneToMany(() => DeliveryParticipant, (participant) => participant.user)
  deliveryParticipations: DeliveryParticipant[];

  @OneToMany(() => DeliveryChat, (chat) => chat.user)
  deliveryChats: DeliveryChat[];
}
