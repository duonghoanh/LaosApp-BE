import { InputType, Field, ID, Int } from '@nestjs/graphql';
import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';

@InputType()
export class GetHistoryInput {
  @Field(() => ID)
  @IsString()
  roomId: string;

  @Field(() => Int, { nullable: true, defaultValue: 50 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  skip?: number;
}
