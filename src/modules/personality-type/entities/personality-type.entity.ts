import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { RoommateProfile } from '../../roommate-profile/entities/roommate-profile.entity';

@Entity()
export class PersonalityType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  typeName: string;

  @Column('text')
  description: string;

  // Relations
  @OneToMany(() => RoommateProfile, (profile) => profile.myPersonalityType)
  profilesWithThisType: RoommateProfile[];

  @OneToMany(() => RoommateProfile, (profile) => profile.preferredPersonalityType)
  profilesPreferringThisType: RoommateProfile[];
}
