import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { FirebaseService } from './firebase.service';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: false,
  },
  namespace: 'chat',
})
export class FirebaseGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(FirebaseGateway.name);
  
  @WebSocketServer() server: Server;
  
  // 활성 사용자 연결 추적을 위한 맵
  private readonly activeUsers = new Map<string, Set<string>>();
  
  constructor(private readonly firebaseService: FirebaseService) {}
  
  afterInit(server: Server) {
    this.logger.log('채팅 WebSocket 게이트웨이가 초기화되었습니다.');
  }
  
  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    const roomId = client.handshake.query.roomId as string;
    
    if (!userId || !roomId) {
      this.logger.warn('WebSocket 연결에 사용자 ID 또는 방 ID가 없습니다. 연결 종료.');
      client.disconnect();
      return;
    }
    
    this.logger.log(`클라이언트 ${client.id}가 방 ${roomId}에 연결되었습니다. (사용자 ID: ${userId})`);
    
    // 소켓 방에 클라이언트 추가
    client.join(roomId);
    
    // 활성 사용자 매핑 업데이트
    if (!this.activeUsers.has(roomId)) {
      this.activeUsers.set(roomId, new Set());
    }
    this.activeUsers.get(roomId).add(userId);
    
    // 활성 사용자 상태 업데이트 및 브로드캐스트
    this.broadcastActiveUsers(roomId);
  }
  
  handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId as string;
    const roomId = client.handshake.query.roomId as string;
    
    if (userId && roomId) {
      this.logger.log(`클라이언트 ${client.id}의 연결이 끊어졌습니다. (방 ID: ${roomId}, 사용자 ID: ${userId})`);
      
      // 활성 사용자 목록에서 제거
      if (this.activeUsers.has(roomId)) {
        this.activeUsers.get(roomId).delete(userId);
        
        // 사용자가 없는 방은 정리
        if (this.activeUsers.get(roomId).size === 0) {
          this.activeUsers.delete(roomId);
        }
      }
      
      // Firebase에 사용자 상태 업데이트
      this.firebaseService.leaveRoom(roomId, userId)
        .catch(error => this.logger.error(`사용자 ${userId}의 방 나가기 처리 중 오류:`, error));
      
      // 다른 사용자들에게 활성 사용자 목록 업데이트 브로드캐스트
      this.broadcastActiveUsers(roomId);
    }
  }
  
  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; userData: any }
  ) {
    try {
      const { roomId, userData } = data;
      
      this.logger.log(`사용자 ${userData.id}가 방 ${roomId} 참여 요청`);
      
      // 방이 존재하는지 확인하고 없으면 생성
      await this.firebaseService.ensureRoomExists(roomId);
      
      // 사용자를 참여자로 등록
      await this.firebaseService.joinRoom(roomId, userData);
      
      // 소켓 방에 클라이언트 추가 (이미 연결 시 추가되었을 수 있지만 명시적으로 다시 추가)
      client.join(roomId);
      
      // 다른 참여자들에게 새 사용자가 참여했음을 알림
      client.to(roomId).emit('user_joined', {
        roomId,
        user: {
          id: userData.id,
          name: userData.name || '익명',
          avatar: userData.avatar || '',
        },
      });
      
      return {
        success: true,
        roomId,
      };
    } catch (error) {
      this.logger.error('방 참여 중 오류:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
  
  @SubscribeMessage('leave_room')
  async handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; userId: string }
  ) {
    try {
      const { roomId, userId } = data;
      
      this.logger.log(`사용자 ${userId}가 방 ${roomId} 나가기 요청`);
      
      // Firebase에 사용자 상태 업데이트
      await this.firebaseService.leaveRoom(roomId, userId);
      
      // 소켓 방에서 클라이언트 제거
      client.leave(roomId);
      
      // 활성 사용자 목록에서 제거
      if (this.activeUsers.has(roomId)) {
        this.activeUsers.get(roomId).delete(userId);
      }
      
      // 다른 참여자들에게 사용자가 나갔음을 알림
      client.to(roomId).emit('user_left', {
        roomId,
        userId,
      });
      
      // 활성 사용자 목록 업데이트 브로드캐스트
      this.broadcastActiveUsers(roomId);
      
      return {
        success: true,
      };
    } catch (error) {
      this.logger.error('방 나가기 중 오류:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
  
  @SubscribeMessage('send_message')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; message: any }
  ) {
    try {
      const { roomId, message } = data;
      
      this.logger.log(`방 ${roomId}에 새 메시지 수신`);
      
      // Firebase에 메시지 저장
      const savedMessage = await this.firebaseService.saveMessage(roomId, message);
      
      // 방의 모든 클라이언트에게 메시지 브로드캐스트
      this.server.to(roomId).emit('new_message', {
        roomId,
        message: savedMessage,
      });
      
      return {
        success: true,
        messageId: savedMessage.id,
      };
    } catch (error) {
      this.logger.error('메시지 전송 중 오류:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
  
  @SubscribeMessage('get_messages')
  async handleGetMessages(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; limit?: number }
  ) {
    try {
      const { roomId, limit } = data;
      
      this.logger.log(`방 ${roomId}의 메시지 조회 요청`);
      
      // Firebase에서 메시지 목록 조회
      const messages = await this.firebaseService.getMessages(roomId, limit);
      
      return {
        success: true,
        messages,
      };
    } catch (error) {
      this.logger.error('메시지 조회 중 오류:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
  
  @SubscribeMessage('get_active_users')
  async handleGetActiveUsers(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string }
  ) {
    try {
      const { roomId } = data;
      
      this.logger.log(`방 ${roomId}의 활성 사용자 조회 요청`);
      
      // Firebase에서 참여자 목록 조회 (데이터베이스에 저장된 모든 참여자)
      const allParticipants = await this.firebaseService.getRoomParticipants(roomId);
      
      // 현재 활성 상태인 사용자 ID 집합
      const activeUserIds = this.activeUsers.has(roomId)
        ? Array.from(this.activeUsers.get(roomId))
        : [];
      
      // 참여자 목록에 활성 상태 추가
      const participants = allParticipants.map(participant => ({
        ...participant,
        isActive: activeUserIds.includes(participant.id),
      }));
      
      return {
        success: true,
        participants,
      };
    } catch (error) {
      this.logger.error('활성 사용자 조회 중 오류:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
  
  // 활성 사용자 목록 브로드캐스트
  private async broadcastActiveUsers(roomId: string) {
    try {
      // Firebase에서 참여자 목록 조회
      const allParticipants = await this.firebaseService.getRoomParticipants(roomId);
      
      // 현재 활성 상태인 사용자 ID 집합
      const activeUserIds = this.activeUsers.has(roomId)
        ? Array.from(this.activeUsers.get(roomId))
        : [];
      
      // 참여자 목록에 활성 상태 추가
      const participants = allParticipants.map(participant => ({
        ...participant,
        isActive: activeUserIds.includes(participant.id),
      }));
      
      // 방의 모든 클라이언트에게 업데이트된 참여자 목록 브로드캐스트
      this.server.to(roomId).emit('active_users_updated', {
        roomId,
        participants,
      });
    } catch (error) {
      this.logger.error(`활성 사용자 브로드캐스트 중 오류 (roomId: ${roomId}):`, error);
    }
  }
}
