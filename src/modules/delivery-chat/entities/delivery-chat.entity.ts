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
export class DeliveryChat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  deliveryRoomId: string;

  @Column()
  userId: string;

  @Column('text')
  message: string;

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @ManyToOne(() => DeliveryRoom, (deliveryRoom) => deliveryRoom.chats)
  @JoinColumn({ name: 'deliveryRoomId' })
  deliveryRoom: DeliveryRoom;

  @ManyToOne(() => User, (user) => user.deliveryChats)
  @JoinColumn({ name: 'userId' })
  user: User;
}
