import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import {
  RoomRole,
  ParticipantStatus,
} from '../../../common/enums/room-role.enum';

registerEnumType(RoomRole, { name: 'RoomRole' });
registerEnumType(ParticipantStatus, { name: 'ParticipantStatus' });

@ObjectType()
export class Participant {
  @Field(() => ID)
  userId: string;

  @Field()
  nickname: string;

  @Field(() => RoomRole)
  role: RoomRole;

  @Field(() => ParticipantStatus)
  status: ParticipantStatus;

  @Field()
  joinedAt: Date;

  @Field({ nullable: true })
  lastSeenAt?: Date;
}

@ObjectType()
@Schema({ timestamps: true })
export class Room {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({ required: true, unique: true })
  code: string;

  @Field()
  @Prop({ required: true })
  name: string;

  @Field({ nullable: true })
  @Prop()
  description?: string;

  @Field(() => ID)
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  hostId: string;

  @Field(() => [Participant])
  @Prop({ type: [Object], default: [] })
  participants: Participant[];

  @Field()
  @Prop({ default: true })
  isActive: boolean;

  @Field({ nullable: true })
  @Prop()
  maxParticipants?: number;

  @Field()
  @Prop({ default: false })
  isPublic: boolean;

  @Field({ nullable: true })
  @Prop()
  password?: string;

  @Field()
  @Prop({ default: Date.now })
  createdAt: Date;

  @Field()
  @Prop({ default: Date.now })
  updatedAt: Date;
}

export type RoomDocument = Room & Document;
export const RoomSchema = SchemaFactory.createForClass(Room);
