import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsString,
  IsOptional,
  IsBoolean,
  MinLength,
  MaxLength,
  Max,
} from 'class-validator';

@InputType()
export class CreateRoomInput {
  @Field()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  password?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @Max(100)
  maxParticipants?: number;
}
