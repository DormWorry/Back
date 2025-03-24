import { RoommateProfile } from '../../roommate-profile/entities/roommate-profile.entity';
export declare class PersonalityType {
    id: number;
    typeName: string;
    description: string;
    profilesWithThisType: RoommateProfile[];
    profilesPreferringThisType: RoommateProfile[];
}
