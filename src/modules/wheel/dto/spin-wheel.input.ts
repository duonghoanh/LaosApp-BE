import { InputType, Field, ID, Int } from '@nestjs/graphql';
import { IsString, IsNumber } from 'class-validator';

@InputType()
export class SpinWheelInput {
  @Field(() => ID)
  @IsString()
  roomId: string;

  @Field(() => ID)
  @IsString()
  wheelId: string;

  @Field(() => Int)
  @IsNumber()
  seed: number;
}
