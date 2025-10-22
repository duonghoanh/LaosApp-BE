import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { RoomService } from '../services/room.service';
import { SocketWithUser } from '../../../common/interfaces/socket-with-user.interface';
import { ParticipantStatus } from '../../../common/enums/room-role.enum';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'room',
})
export class RoomGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly roomService: RoomService) {}

  handleConnection(@ConnectedSocket() client: SocketWithUser) {
    console.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(@ConnectedSocket() client: SocketWithUser) {
    console.log(`Client disconnected: ${client.id}`);

    if (client.user?.userId && client.user?.roomId) {
      await this.roomService.leaveRoom(client.user.userId, client.user.roomId);

      this.server.to(client.user.roomId).emit('participantLeft', {
        userId: client.user.userId,
        nickname: client.user.nickname,
        timestamp: new Date(),
      });
    }
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() client: SocketWithUser,
    @MessageBody() data: { roomId: string; userId: string; nickname: string },
  ) {
    const { roomId, userId, nickname } = data;

    client.user = { userId, nickname, roomId };

    // Join socket room
    await client.join(roomId);

    // Get online participants
    const participants = await this.roomService.getOnlineParticipants(roomId);

    // Notify others
    client.to(roomId).emit('participantJoined', {
      userId,
      nickname,
      timestamp: new Date(),
    });

    // Send current participants to new user
    client.emit('participantsList', participants);

    return { success: true, participants };
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(@ConnectedSocket() client: SocketWithUser) {
    if (client.user?.roomId && client.user?.userId) {
      await this.roomService.leaveRoom(client.user.userId, client.user.roomId);

      this.server.to(client.user.roomId).emit('participantLeft', {
        userId: client.user.userId,
        nickname: client.user.nickname,
        timestamp: new Date(),
      });

      await client.leave(client.user.roomId);
    }

    return { success: true };
  }

  @SubscribeMessage('updateStatus')
  handleUpdateStatus(
    @ConnectedSocket() client: SocketWithUser,
    @MessageBody() data: { status: ParticipantStatus },
  ) {
    if (client.user?.roomId) {
      this.server.to(client.user.roomId).emit('statusUpdated', {
        userId: client.user.userId,
        status: data.status,
        timestamp: new Date(),
      });
    }

    return { success: true };
  }

  // Helper method to emit to specific room
  emitToRoom(roomId: string, event: string, data: unknown) {
    this.server.to(roomId).emit(event, data);
  }
}
