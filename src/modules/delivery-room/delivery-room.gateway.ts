import { 
  WebSocketGateway, 
  SubscribeMessage, 
  MessageBody, 
  ConnectedSocket, 
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { DeliveryRoomService } from './delivery-room.service';
import { DeliveryParticipantService } from '../delivery-participant/delivery-participant.service';
import { DeliveryChatService } from '../delivery-chat/delivery-chat.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { JoinRoomDto } from './dto/join-room.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { UseGuards } from '@nestjs/common';
import { JwtSocketGuard } from '../auth/guards/jwt-socket.guard';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'delivery',
})
export class DeliveryRoomGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedClients: Map<string, string> = new Map(); // userId -> socketId

  constructor(
    private readonly deliveryRoomService: DeliveryRoomService,
    private readonly deliveryParticipantService: DeliveryParticipantService,
    private readonly deliveryChatService: DeliveryChatService,
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.auth.token;
    if (!token) {
      client.disconnect();
      return;
    }

    try {
      // JWT 검증 로직은 실제 구현에서 추가
      const userId = client.handshake.auth.userId;
      if (userId) {
        this.connectedClients.set(userId, client.id);
        client.join('delivery-rooms'); // 기본 채널 구독
        console.log(`Client connected: ${userId}, socketId: ${client.id}`);
      }
    } catch (e) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    let disconnectedUserId = null;
    
    for (const [userId, socketId] of this.connectedClients.entries()) {
      if (socketId === client.id) {
        disconnectedUserId = userId;
        break;
      }
    }

    if (disconnectedUserId) {
      this.connectedClients.delete(disconnectedUserId);
      console.log(`Client disconnected: ${disconnectedUserId}`);
    }
  }

  @SubscribeMessage('createRoom')
  async handleCreateRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() createRoomDto: CreateRoomDto
  ) {
    try {
      const userId = client.handshake.auth.userId;
      const newRoom = await this.deliveryRoomService.createRoom(userId, createRoomDto);
      
      // 자동으로 방 생성자를 참여자로 추가
      await this.deliveryParticipantService.joinRoom({
        userId,
        deliveryRoomId: newRoom.id,
        orderDetails: '',
        amount: 0
      });

      // 업데이트된 룸 목록을 모든 클라이언트에게 브로드캐스트
      const updatedRooms = await this.deliveryRoomService.getRooms();
      this.server.to('delivery-rooms').emit('roomsUpdated', updatedRooms);
      
      // 방 생성자를 방 채널에 조인 (채팅을 위해)
      client.join(`room-${newRoom.id}`);
      
      return { success: true, room: newRoom };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @SubscribeMessage('getRooms')
  async handleGetRooms() {
    try {
      const rooms = await this.deliveryRoomService.getRooms();
      return { success: true, rooms };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() joinRoomDto: JoinRoomDto
  ) {
    try {
      const userId = client.handshake.auth.userId;
      const roomId = joinRoomDto.deliveryRoomId;
      
      // 참여자로 추가
      await this.deliveryParticipantService.joinRoom({
        userId,
        deliveryRoomId: roomId,
        orderDetails: joinRoomDto.orderDetails || '',
        amount: joinRoomDto.amount || 0
      });

      // 소켓 룸에 참여
      client.join(`room-${roomId}`);
      
      // 룸 상세 정보 가져오기
      const roomDetails = await this.deliveryRoomService.getRoomWithParticipants(roomId);
      
      // 참여자가 업데이트되었음을 알림
      this.server.to(`room-${roomId}`).emit('participantsUpdated', roomDetails.participants);
      
      return { success: true, room: roomDetails };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string }
  ) {
    try {
      const userId = client.handshake.auth.userId;
      const roomId = data.roomId;
      
      await this.deliveryParticipantService.leaveRoom(userId, roomId);
      
      // 소켓 룸에서 나가기
      client.leave(`room-${roomId}`);
      
      // 룸 상세 정보 가져오기
      const roomDetails = await this.deliveryRoomService.getRoomWithParticipants(roomId);
      
      // 참여자가 업데이트되었음을 알림
      this.server.to(`room-${roomId}`).emit('participantsUpdated', roomDetails.participants);
      
      // 만약 참여자가 없으면 방 삭제 로직 추가 가능
      
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() messageDto: SendMessageDto
  ) {
    try {
      const userId = client.handshake.auth.userId;
      const { roomId, message } = messageDto;
      
      // 메시지 저장
      const chatMessage = await this.deliveryChatService.createMessage(userId, roomId, message);
      
      // 해당 방에 있는 모든 사용자에게 메시지 전송
      this.server.to(`room-${roomId}`).emit('newMessage', chatMessage);
      
      return { success: true, message: chatMessage };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @SubscribeMessage('getMessages')
  async handleGetMessages(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string }
  ) {
    try {
      const { roomId } = data;
      const messages = await this.deliveryChatService.getMessages(roomId);
      
      return { success: true, messages };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}
