import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

@InputType()
export class JoinRoomInput {
  @Field()
  @IsString()
  @MinLength(6)
  @MaxLength(6)
  code: string;

  @Field()
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  nickname: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  password?: string;
}
