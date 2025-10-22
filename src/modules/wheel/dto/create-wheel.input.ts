import { InputType, Field, ID, Int, Float } from '@nestjs/graphql';
import {
  IsString,
  IsArray,
  ValidateNested,
  IsNumber,
  IsOptional,
  IsBoolean,
  Min,
  Max,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class WheelSegmentInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  id?: string;

  @Field()
  @IsString()
  text: string;

  @Field()
  @IsString()
  color: string;

  @Field(() => Float)
  @IsNumber()
  @Min(0.1)
  @Max(100)
  weight: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  icon?: string;

  @Field(() => Int)
  @IsNumber()
  order: number;
}

@InputType()
export class CreateWheelInput {
  @Field(() => ID)
  @IsString()
  roomId: string;

  @Field()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  title: string;

  @Field(() => [WheelSegmentInput])
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WheelSegmentInput)
  segments: WheelSegmentInput[];

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(2000)
  @Max(10000)
  spinDuration?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  soundEnabled?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  confettiEnabled?: boolean;
}

@InputType()
export class UpdateWheelInput {
  @Field(() => ID)
  @IsString()
  wheelId: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  title?: string;

  @Field(() => [WheelSegmentInput], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WheelSegmentInput)
  segments?: WheelSegmentInput[];

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(2000)
  @Max(10000)
  spinDuration?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  soundEnabled?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  confettiEnabled?: boolean;
}

@InputType()
export class SpinWheelInput {
  @Field(() => ID)
  @IsString()
  wheelId: string;
}
