import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LetterModule } from './modules/letter/letter.module';
import { UserModule } from './modules/user/user.module';
import { PersonalityTypeModule } from './modules/personality-type/personality-type.module';
import { RoommateProfileModule } from './modules/roommate-profile/roommate-profile.module';
import { DeliveryRoomModule } from './modules/delivery-room/delivery-room.module';
import { DeliveryParticipantModule } from './modules/delivery-participant/delivery-participant.module';
import { DeliveryChatModule } from './modules/delivery-chat/delivery-chat.module';
import { DormitoryModule } from './modules/dormitory/dormitory.module';
import { DormitoryAnnouncementModule } from './modules/dormitory-announcement/dormitory-announcement.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '3306', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    LetterModule,
    UserModule,
    PersonalityTypeModule,
    RoommateProfileModule,
    DeliveryRoomModule,
    DeliveryParticipantModule,
    DeliveryChatModule,
    DormitoryModule,
    DormitoryAnnouncementModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
