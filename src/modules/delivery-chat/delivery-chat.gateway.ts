import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { DeliveryRoom } from '../delivery-room/entities/delivery-room.entity';

// 인메모리 채팅 메시지 타입 정의
interface ChatMessage {
  id: string;
  roomId: string;
  userId: string;
  nickname: string;
  message: string;
  createdAt: Date;
}

@WebSocketGateway({
  cors: {
    origin: '*', // 실제 배포 시에는 구체적인 도메인으로 제한 필요
  },
  namespace: 'delivery-chat',
})
export class DeliveryChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  // 인메모리 채팅 메시지 저장소 (roomId를 키로 사용)
  private chatMessages: Map<string, ChatMessage[]> = new Map();

  // 연결된 클라이언트 정보 저장 (socketId를 키로 사용)
  private connectedClients: Map<
    string,
    { userId: string; nickname: string; roomIds: string[] }
  > = new Map();

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(DeliveryRoom)
    private roomRepository: Repository<DeliveryRoom>,
  ) {}

  // 클라이언트 연결 핸들러
  async handleConnection(client: Socket) {
    // 사용자 인증
    const token = client.handshake.auth.token;
    if (!token) {
      client.disconnect();
      return;
    }

    try {
      // JWT 검증 및 사용자 정보 추출 (실제 구현 필요)
      // 여기서는 간단히 예시로 보여드립니다
      const userId = this.verifyToken(token);
      const user = await this.userRepository.findOne({ where: { id: userId } });

      if (!user) {
        client.disconnect();
        return;
      }

      // 클라이언트 정보 저장
      this.connectedClients.set(client.id, {
        userId: user.id,
        nickname: user.nickname,
        roomIds: [],
      });

      console.log(`Client connected: ${client.id}, User: ${user.nickname}`);
    } catch (error) {
      client.disconnect();
      console.error('Connection error:', error.message);
    }
  }

  // 클라이언트 연결 해제 핸들러
  handleDisconnect(client: Socket) {
    // 클라이언트가 참여한 모든 방에서 떠나기
    const clientInfo = this.connectedClients.get(client.id);
    if (clientInfo) {
      clientInfo.roomIds.forEach((roomId) => {
        client.leave(roomId);
        this.server.to(roomId).emit('userLeft', {
          userId: clientInfo.userId,
          nickname: clientInfo.nickname,
        });
      });

      // 클라이언트 정보 삭제
      this.connectedClients.delete(client.id);
    }

    console.log(`Client disconnected: ${client.id}`);
  }

  // 방 입장 메시지 처리
  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string },
  ) {
    const clientInfo = this.connectedClients.get(client.id);
    if (!clientInfo) return;

    const { roomId } = data;

    // 방 존재 여부 확인
    const room = await this.roomRepository.findOne({ where: { id: roomId } });
    if (!room) {
      client.emit('error', { message: '존재하지 않는 방입니다.' });
      return;
    }

    // 클라이언트를 방에 추가
    client.join(roomId);

    // 클라이언트 정보 업데이트
    if (!clientInfo.roomIds.includes(roomId)) {
      clientInfo.roomIds.push(roomId);
      this.connectedClients.set(client.id, clientInfo);
    }

    // 방에 있는 모든 클라이언트에게 새 사용자 입장 알림
    this.server.to(roomId).emit('userJoined', {
      userId: clientInfo.userId,
      nickname: clientInfo.nickname,
    });

    // 이전 채팅 기록 전송
    const messages = this.chatMessages.get(roomId) || [];
    client.emit('chatHistory', messages);
  }

  // 방 퇴장 메시지 처리
  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string },
  ) {
    const clientInfo = this.connectedClients.get(client.id);
    if (!clientInfo) return;

    const { roomId } = data;

    // 클라이언트를 방에서 제거
    client.leave(roomId);

    // 클라이언트 정보 업데이트
    clientInfo.roomIds = clientInfo.roomIds.filter((id) => id !== roomId);
    this.connectedClients.set(client.id, clientInfo);

    // 방에 있는 모든 클라이언트에게 사용자 퇴장 알림
    this.server.to(roomId).emit('userLeft', {
      userId: clientInfo.userId,
      nickname: clientInfo.nickname,
    });
  }

  // 채팅 메시지 처리
  @SubscribeMessage('sendMessage')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; message: string },
  ) {
    const clientInfo = this.connectedClients.get(client.id);
    if (!clientInfo) return;

    const { roomId, message } = data;

    // 메시지 생성
    const chatMessage: ChatMessage = {
      id: this.generateId(),
      roomId,
      userId: clientInfo.userId,
      nickname: clientInfo.nickname,
      message,
      createdAt: new Date(),
    };

    // 메시지 저장 (인메모리)
    if (!this.chatMessages.has(roomId)) {
      this.chatMessages.set(roomId, []);
    }
    this.chatMessages.get(roomId).push(chatMessage);

    // 최대 100개 메시지만 저장
    const messages = this.chatMessages.get(roomId);
    if (messages.length > 100) {
      messages.shift(); // 가장 오래된 메시지 제거
    }

    // 방에 있는 모든 클라이언트에게 메시지 전송
    this.server.to(roomId).emit('newMessage', chatMessage);
  }

  // 방 참여자 목록 요청 처리
  @SubscribeMessage('getRoomUsers')
  handleGetRoomUsers(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string },
  ) {
    const { roomId } = data;
    const roomUsers = [];

    // 방에 참여한 모든 사용자 정보 수집
    this.connectedClients.forEach((clientInfo, socketId) => {
      if (clientInfo.roomIds.includes(roomId)) {
        roomUsers.push({
          userId: clientInfo.userId,
          nickname: clientInfo.nickname,
        });
      }
    });

    // 요청한 클라이언트에게만 사용자 목록 전송
    client.emit('roomUsers', { roomId, users: roomUsers });
  }

  // 편의 메서드: 고유 ID 생성
  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substring(2, 9);
  }

  // 편의 메서드: JWT 토큰 검증 (실제 구현 필요)
  private verifyToken(token: string): string {
    // 실제로는 JWT 라이브러리로 토큰 검증 및 payload 추출
    // 예시로 임시 구현
    try {
      // 여기에 실제 JWT 검증 로직 구현 필요
      return '1'; // 임시 userId 반환
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
