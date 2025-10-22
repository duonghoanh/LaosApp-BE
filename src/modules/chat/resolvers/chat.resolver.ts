import { Resolver, Query, Mutation, Args, ID, Int } from '@nestjs/graphql';
import { ChatService } from '../services/chat.service';
import { ChatMessage } from '../entities/chat-message.entity';
import { SendMessageInput } from '../dto/send-message.input';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';

@Resolver(() => ChatMessage)
export class ChatResolver {
  constructor(private readonly chatService: ChatService) {}

  @Mutation(() => ChatMessage)
  async sendMessage(
    @CurrentUser() userId: string,
    @Args('input') input: SendMessageInput,
    @Args('nickname') nickname: string,
  ): Promise<ChatMessage> {
    return this.chatService.sendMessage(userId, nickname, input);
  }

  @Query(() => [ChatMessage])
  async chatMessages(
    @Args('roomId', { type: () => ID }) roomId: string,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 50 })
    limit: number,
    @Args('skip', { type: () => Int, nullable: true, defaultValue: 0 })
    skip: number,
  ): Promise<ChatMessage[]> {
    return this.chatService.getMessages(roomId, limit, skip);
  }

  @Mutation(() => Boolean)
  async clearMessages(
    @Args('roomId', { type: () => ID }) roomId: string,
  ): Promise<boolean> {
    return this.chatService.clearMessages(roomId);
  }
}
