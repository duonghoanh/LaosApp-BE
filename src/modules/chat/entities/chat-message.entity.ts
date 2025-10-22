import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';

export enum MessageType {
  TEXT = 'TEXT',
  SYSTEM = 'SYSTEM',
  SPIN_RESULT = 'SPIN_RESULT',
  USER_JOINED = 'USER_JOINED',
  USER_LEFT = 'USER_LEFT',
}

registerEnumType(MessageType, { name: 'MessageType' });

@ObjectType()
@Schema({ timestamps: true })
export class ChatMessage {
  @Field(() => ID)
  _id: string;

  @Field(() => ID)
  @Prop({ type: Types.ObjectId, ref: 'Room', required: true })
  roomId: string;

  @Field(() => ID, { nullable: true })
  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId?: string;

  @Field({ nullable: true })
  @Prop()
  nickname?: string;

  @Field(() => MessageType)
  @Prop({ required: true, enum: MessageType })
  type: MessageType;

  @Field()
  @Prop({ required: true })
  content: string;

  @Field({ nullable: true })
  @Prop()
  emoji?: string;

  @Field()
  @Prop({ default: Date.now })
  createdAt: Date;
}

export type ChatMessageDocument = ChatMessage & Document;
export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);
