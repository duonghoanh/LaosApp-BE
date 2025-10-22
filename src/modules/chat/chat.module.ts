import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatMessage, ChatMessageSchema } from './entities/chat-message.entity';
import { ChatService } from './services/chat.service';
import { ChatResolver } from './resolvers/chat.resolver';
import { ChatGateway } from './gateways/chat.gateway';
import { RoomModule } from '../room/room.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChatMessage.name, schema: ChatMessageSchema },
    ]),
    RoomModule,
  ],
  providers: [ChatService, ChatResolver, ChatGateway],
  exports: [ChatService],
})
export class ChatModule {}
