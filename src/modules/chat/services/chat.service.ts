import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ChatMessage,
  ChatMessageDocument,
  MessageType,
} from '../entities/chat-message.entity';
import { SendMessageInput } from '../dto/send-message.input';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(ChatMessage.name)
    private chatMessageModel: Model<ChatMessageDocument>,
  ) {}

  sendMessage(
    userId: string,
    nickname: string,
    sendMessageInput: SendMessageInput,
  ): Promise<ChatMessage> {
    const message = new this.chatMessageModel({
      roomId: sendMessageInput.roomId,
      userId,
      nickname,
      type: MessageType.TEXT,
      content: sendMessageInput.content,
    });

    return message.save();
  }

  sendSystemMessage(
    roomId: string,
    content: string,
    type: MessageType,
  ): Promise<ChatMessage> {
    const message = new this.chatMessageModel({
      roomId,
      type,
      content,
    });

    return message.save();
  }

  async getMessages(
    roomId: string,
    limit = 50,
    skip = 0,
  ): Promise<ChatMessage[]> {
    return this.chatMessageModel
      .find({ roomId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);
  }

  async clearMessages(roomId: string): Promise<boolean> {
    await this.chatMessageModel.deleteMany({ roomId });
    return true;
  }
}
