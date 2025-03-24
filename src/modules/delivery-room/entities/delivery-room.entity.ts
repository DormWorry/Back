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
import { User } from '../../user/entities/user.entity';
import { DeliveryParticipant } from '../../delivery-participant/entities/delivery-participant.entity';
import { DeliveryChat } from '../../delivery-chat/entities/delivery-chat.entity';

export enum DeliveryRoomStatus {
  OPEN = 'open',
  CLOSED = 'closed',
  COMPLETED = 'completed',
}

@Entity()
export class DeliveryRoom {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  creatorId: string;

  @Column()
  restaurantName: string;

  @Column()
  category: string;

  @Column()
  minimumOrderAmount: number;

  @Column()
  deliveryFee: number;

  @Column('text')
  description: string;

  @Column({
    type: 'enum',
    enum: DeliveryRoomStatus,
    default: DeliveryRoomStatus.OPEN,
  })
  status: DeliveryRoomStatus;

  @Column({ nullable: true })
  orderedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.createdDeliveryRooms)
  @JoinColumn({ name: 'creatorId' })
  creator: User;

  @OneToMany(() => DeliveryParticipant, (participant) => participant.deliveryRoom)
  participants: DeliveryParticipant[];

  @OneToMany(() => DeliveryChat, (chat) => chat.deliveryRoom)
  chats: DeliveryChat[];
}
