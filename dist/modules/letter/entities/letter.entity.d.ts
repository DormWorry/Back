import { User } from '../../user/entities/user.entity';
export declare class Letter {
    id: string;
    title: string;
    content: string;
    senderUserId: string;
    senderRoomNumber: string;
    senderName: string;
    recipientUserId: string;
    recipientRoomNumber: string;
    isAnonymous: boolean;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
    sender: User;
    recipient: User;
}
