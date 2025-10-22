import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class SendEmojiInput {
  @Field(() => ID)
  @IsString()
  roomId: string;

  @Field()
  @IsString()
  emoji: string;
}
