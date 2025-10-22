import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString, MaxLength } from 'class-validator';

@InputType()
export class SendMessageInput {
  @Field(() => ID)
  @IsString()
  roomId: string;

  @Field()
  @IsString()
  @MaxLength(500)
  content: string;
}
