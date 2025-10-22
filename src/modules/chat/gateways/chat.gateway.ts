import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ChatService } from '../services/chat.service';
import { SocketWithUser } from '../../../common/interfaces/socket-with-user.interface';
import { SendMessageInput } from '../dto/send-message.input';
import { SendEmojiInput } from '../dto/send-emoji.input';
import { MessageType } from '../entities/chat-message.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'chat',
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: SocketWithUser,
    @MessageBody() data: SendMessageInput & { nickname: string },
  ) {
    const { roomId, content, nickname } = data;

    const message = await this.chatService.sendMessage(
      client.user?.userId || 'anonymous',
      nickname,
      { roomId, content },
    );

    // Broadcast to all in room
    this.server.to(roomId).emit('newMessage', message);

    return { success: true, message };
  }

  @SubscribeMessage('sendEmoji')
  handleEmoji(
    @ConnectedSocket() client: SocketWithUser,
    @MessageBody() data: SendEmojiInput & { nickname: string },
  ) {
    const { roomId, emoji, nickname } = data;

    // Broadcast emoji reaction
    this.server.to(roomId).emit('emojiReaction', {
      userId: client.user?.userId,
      nickname,
      emoji,
      timestamp: new Date(),
    });

    return { success: true };
  }

  @SubscribeMessage('joinChatRoom')
  async handleJoinChatRoom(
    @ConnectedSocket() client: SocketWithUser,
    @MessageBody() data: { roomId: string },
  ) {
    await client.join(data.roomId);
    return { success: true };
  }

  async emitSystemMessage(roomId: string, content: string, type: MessageType) {
    const message = await this.chatService.sendSystemMessage(
      roomId,
      content,
      type,
    );
    this.server.to(roomId).emit('systemMessage', message);
  }
}
