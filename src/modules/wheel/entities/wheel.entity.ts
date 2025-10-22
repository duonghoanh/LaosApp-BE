import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class WheelSegment {
  @Field(() => ID)
  id: string;

  @Field()
  text: string;

  @Field()
  color: string;

  @Field(() => Float)
  weight: number;

  @Field({ nullable: true })
  icon?: string;

  @Field(() => Int)
  order: number;
}

@ObjectType()
@Schema({ timestamps: true })
export class Wheel {
  @Field(() => ID)
  _id: string;

  @Field(() => ID)
  @Prop({ type: Types.ObjectId, ref: 'Room', required: true })
  roomId: string;

  @Field()
  @Prop({ required: true })
  title: string;

  @Field(() => [WheelSegment])
  @Prop({ type: [Object], required: true })
  segments: WheelSegment[];

  @Field(() => Int)
  @Prop({ default: 5000 })
  spinDuration: number;

  @Field()
  @Prop({ default: true })
  soundEnabled: boolean;

  @Field()
  @Prop({ default: true })
  confettiEnabled: boolean;

  @Field()
  @Prop({ default: Date.now })
  createdAt: Date;

  @Field()
  @Prop({ default: Date.now })
  updatedAt: Date;
}

export type WheelDocument = Wheel & Document;
export const WheelSchema = SchemaFactory.createForClass(Wheel);
