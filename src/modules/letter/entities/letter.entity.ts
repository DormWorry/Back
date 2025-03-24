import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Letter {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column()
  senderUserId: string;

  @Column()
  senderRoomNumber: string;

  @Column({ nullable: true })
  senderName: string;

  @Column()
  recipientUserId: string;

  @Column()
  recipientRoomNumber: string;

  @Column({ default: false })
  isAnonymous: boolean;

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.sentLetters)
  @JoinColumn({ name: 'senderUserId' })
  sender: User;

  @ManyToOne(() => User, (user) => user.receivedLetters)
  @JoinColumn({ name: 'recipientUserId' })
  recipient: User;
}
