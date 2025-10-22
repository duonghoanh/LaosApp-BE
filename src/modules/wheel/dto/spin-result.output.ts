import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { WheelSegment } from '../entities/wheel.entity';

@ObjectType()
export class SpinResult {
  @Field(() => ID)
  spinId: string;

  @Field(() => WheelSegment)
  winner: WheelSegment;

  @Field(() => Int)
  rotation: number;

  @Field(() => Int)
  seed: number;

  @Field()
  spinnerNickname: string;

  @Field()
  timestamp: Date;
}
