import { User } from '../../user/entities/user.entity';
import { DeliveryRoom } from '../../delivery-room/entities/delivery-room.entity';
export declare class DeliveryParticipant {
    id: string;
    deliveryRoomId: string;
    userId: string;
    orderDetails: string;
    amount: number;
    isPaid: boolean;
    joinedAt: Date;
    deliveryRoom: DeliveryRoom;
    user: User;
}
