import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class SegmentStatistics {
  @Field()
  segmentId: string;

  @Field()
  text: string;

  @Field(() => Int)
  count: number;

  @Field()
  percentage: number;
}

@ObjectType()
export class RoomStatistics {
  @Field(() => Int)
  totalSpins: number;

  @Field(() => [SegmentStatistics])
  segmentStats: SegmentStatistics[];

  @Field()
  lastSpunAt?: Date;
}
