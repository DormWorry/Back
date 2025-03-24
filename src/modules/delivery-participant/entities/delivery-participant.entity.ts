import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { DeliveryRoom } from '../../delivery-room/entities/delivery-room.entity';

@Entity()
export class DeliveryParticipant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  deliveryRoomId: string;

  @Column()
  userId: string;

  @Column('text')
  orderDetails: string;

  @Column()
  amount: number;

  @Column({ default: false })
  isPaid: boolean;

  @CreateDateColumn()
  joinedAt: Date;

  // Relations
  @ManyToOne(() => DeliveryRoom, (deliveryRoom) => deliveryRoom.participants)
  @JoinColumn({ name: 'deliveryRoomId' })
  deliveryRoom: DeliveryRoom;

  @ManyToOne(() => User, (user) => user.deliveryParticipations)
  @JoinColumn({ name: 'userId' })
  user: User;
}
