import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseService.name);
  private db: admin.firestore.Firestore;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    try {
      // Firebase Admin 초기화
      if (!admin.apps.length) {
        // 서비스 계정 키가 있는 경우 - 프로덕션 환경
        const serviceAccount = this.configService.get('FIREBASE_SERVICE_ACCOUNT');
        
        if (serviceAccount) {
          // JSON 문자열에서 객체로 변환
          const serviceAccountObj = JSON.parse(serviceAccount);
          
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccountObj),
            databaseURL: this.configService.get('FIREBASE_DATABASE_URL'),
          });
        } else {
          // 서비스 계정 키가 없는 경우 - 개발 환경
          admin.initializeApp();
          this.logger.warn('Firebase 서비스 계정 키가 제공되지 않았습니다. 기본 인증 방식을 사용합니다.');
        }
        
        this.db = admin.firestore();
        this.logger.log('Firebase Admin이 초기화되었습니다.');
      } else {
        this.db = admin.firestore();
        this.logger.log('기존 Firebase Admin 인스턴스를 사용합니다.');
      }
    } catch (error) {
      this.logger.error('Firebase Admin 초기화 중 오류 발생:', error);
      throw error;
    }
  }

  /**
   * Firebase Firestore 인스턴스 반환
   */
  getFirestore(): admin.firestore.Firestore {
    return this.db;
  }

  /**
   * 채팅방에 메시지 저장
   */
  async saveMessage(roomId: string, messageData: any): Promise<any> {
    try {
      const messagesRef = this.db.collection(`rooms/${roomId}/messages`);
      const messageWithTimestamp = {
        ...messageData,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      };

      const docRef = await messagesRef.add(messageWithTimestamp);
      const doc = await docRef.get();
      
      return {
        id: docRef.id,
        ...messageWithTimestamp,
        timestamp: new Date(), // 클라이언트에 반환할 때는 JavaScript Date 객체로 변환
      };
    } catch (error) {
      this.logger.error(`메시지 저장 중 오류 발생 (roomId: ${roomId}):`, error);
      throw error;
    }
  }

  /**
   * 채팅방의 메시지 목록 조회
   */
  async getMessages(roomId: string, limit: number = 100): Promise<any[]> {
    try {
      const messagesRef = this.db.collection(`rooms/${roomId}/messages`);
      const snapshot = await messagesRef
        .orderBy('timestamp', 'asc')
        .limit(limit)
        .get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      this.logger.error(`메시지 조회 중 오류 발생 (roomId: ${roomId}):`, error);
      throw error;
    }
  }

  /**
   * 채팅방 참여자 등록
   */
  async joinRoom(roomId: string, userData: any): Promise<boolean> {
    try {
      if (!userData || !userData.id) {
        throw new Error('사용자 정보가 유효하지 않습니다.');
      }

      const participantRef = this.db.doc(`rooms/${roomId}/participants/${userData.id}`);
      
      await participantRef.set({
        id: userData.id,
        name: userData.name || '익명',
        avatar: userData.avatar || '',
        lastActive: admin.firestore.FieldValue.serverTimestamp(),
        isActive: true,
      }, { merge: true });
      
      return true;
    } catch (error) {
      this.logger.error(`채팅방 참여 중 오류 발생 (roomId: ${roomId}, userId: ${userData?.id}):`, error);
      throw error;
    }
  }

  /**
   * 채팅방 나가기
   */
  async leaveRoom(roomId: string, userId: string): Promise<boolean> {
    try {
      const participantRef = this.db.doc(`rooms/${roomId}/participants/${userId}`);
      
      await participantRef.update({
        isActive: false,
        leftAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      
      return true;
    } catch (error) {
      this.logger.error(`채팅방 나가기 중 오류 발생 (roomId: ${roomId}, userId: ${userId}):`, error);
      throw error;
    }
  }

  /**
   * 채팅방 생성 또는 확인
   */
  async ensureRoomExists(roomId: string, roomData: any = {}): Promise<any> {
    try {
      const roomRef = this.db.doc(`rooms/${roomId}`);
      const roomDoc = await roomRef.get();
      
      if (!roomDoc.exists) {
        // 방이 존재하지 않으면 생성
        const defaultRoomData = {
          id: roomId,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          ...roomData,
        };
        
        await roomRef.set(defaultRoomData);
        return { id: roomId, ...defaultRoomData, new: true };
      }
      
      return { id: roomId, ...roomDoc.data(), new: false };
    } catch (error) {
      this.logger.error(`채팅방 생성/확인 중 오류 발생 (roomId: ${roomId}):`, error);
      throw error;
    }
  }

  /**
   * 채팅방의 참여자 목록 조회
   */
  async getRoomParticipants(roomId: string): Promise<any[]> {
    try {
      const participantsRef = this.db.collection(`rooms/${roomId}/participants`);
      const snapshot = await participantsRef.get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      this.logger.error(`참여자 목록 조회 중 오류 발생 (roomId: ${roomId}):`, error);
      throw error;
    }
  }
}
