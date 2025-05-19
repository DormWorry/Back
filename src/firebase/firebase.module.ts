import { Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { FirebaseController } from './firebase.controller';
import { FirebaseGateway } from './firebase.gateway';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [FirebaseController],
  providers: [FirebaseService, FirebaseGateway],
  exports: [FirebaseService],
})
export class FirebaseModule {}
