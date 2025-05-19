import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { FirebaseModule } from './firebase/firebase.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: parseInt(configService.get('DB_PORT') ?? '3306', 10),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') !== 'production',
        // AWS RDS 연결을 위한 추가 설정
        ssl: configService.get('NODE_ENV') === 'production' ? {
          // SSL 인증서 검증 비활성화 (자체 서명 인증서 사용 시)
          rejectUnauthorized: false
        } : false,
        extra: {
          // 연결 풀 설정
          connectionLimit: 10,
          // 연결 타임아웃 설정
          connectTimeout: 60000,
          // 유휴 연결 제한 시간
          acquireTimeout: 60000,
          // 연결 재시도 설정
          waitForConnections: true,
          queueLimit: 0,
        },
        // 로깅 설정
        logging: configService.get('NODE_ENV') !== 'production',
        // 자동 재연결 설정
        autoLoadEntities: true,
      }),
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
    FirebaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
