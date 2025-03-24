import { User } from '../../user/entities/user.entity';
import { DeliveryRoom } from '../../delivery-room/entities/delivery-room.entity';
export declare class DeliveryChat {
    id: string;
    deliveryRoomId: string;
    userId: string;
    message: string;
    createdAt: Date;
    deliveryRoom: DeliveryRoom;
    user: User;
}
