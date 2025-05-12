import { Dormitory } from '../../dormitory/entities/dormitory.entity';
import { Letter } from '../../letter/entities/letter.entity';
import { DeliveryRoom } from '../../delivery-room/entities/delivery-room.entity';
import { DeliveryParticipant } from '../../delivery-participant/entities/delivery-participant.entity';
import { DeliveryChat } from '../../delivery-chat/entities/delivery-chat.entity';
export declare enum Gender {
    MALE = "male",
    FEMALE = "female"
}
export declare const DORMITORY_TYPES: {
    DORM1: string;
    DORM2: string;
    DORM3: string;
};
export declare class User {
    id: number;
    kakaoId: string;
    nickname: string;
    email: string;
    studentId: string;
    department: string;
    dormitoryId: number;
    roomNumber: string;
    gender: Gender;
    createdAt: Date;
    updatedAt: Date;
    isNewUser: boolean;
    dormitory: Dormitory;
    sentLetters: Letter[];
    receivedLetters: Letter[];
    createdDeliveryRooms: DeliveryRoom[];
    deliveryParticipations: DeliveryParticipant[];
    deliveryChats: DeliveryChat[];
}
