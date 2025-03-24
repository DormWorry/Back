import { User } from '../../user/entities/user.entity';
import { PersonalityType } from '../../personality-type/entities/personality-type.entity';
export declare class RoommateProfile {
    id: string;
    userId: string;
    myPersonalityTypeId: number;
    preferredPersonalityTypeId: number;
    kakaoTalkId: string;
    instagramId: string;
    introduction: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    myPersonalityType: PersonalityType;
    preferredPersonalityType: PersonalityType;
}
