import { User } from '../../user/entities/user.entity';
import { DeliveryParticipant } from '../../delivery-participant/entities/delivery-participant.entity';
import { DeliveryChat } from '../../delivery-chat/entities/delivery-chat.entity';
export declare enum DeliveryRoomStatus {
    OPEN = "open",
    CLOSED = "closed",
    COMPLETED = "completed"
}
export declare class DeliveryRoom {
    id: string;
    creatorId: string;
    restaurantName: string;
    category: string;
    minimumOrderAmount: number;
    deliveryFee: number;
    description: string;
    status: DeliveryRoomStatus;
    orderedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    creator: User;
    participants: DeliveryParticipant[];
    chats: DeliveryChat[];
}
