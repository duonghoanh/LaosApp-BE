import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
@Schema({ timestamps: true })
export class SpinHistory {
  @Field(() => ID)
  _id: string;

  @Field(() => ID)
  @Prop({ type: Types.ObjectId, ref: 'Room', required: true })
  roomId: string;

  @Field(() => ID)
  @Prop({ type: Types.ObjectId, ref: 'Wheel', required: true })
  wheelId: string;

  @Field(() => ID)
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  spinnerId: string;

  @Field()
  @Prop({ required: true })
  spinnerNickname: string;

  @Field()
  @Prop({ required: true })
  result: string;

  @Field()
  @Prop({ required: true })
  segmentId: string;

  @Field(() => Int)
  @Prop({ required: true })
  seed: number;

  @Field(() => Int)
  @Prop({ required: true })
  rotation: number;

  @Field()
  @Prop({ default: Date.now })
  spunAt: Date;
}

export type SpinHistoryDocument = SpinHistory & Document;
export const SpinHistorySchema = SchemaFactory.createForClass(SpinHistory);
