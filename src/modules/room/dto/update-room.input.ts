import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString, IsOptional } from 'class-validator';

@InputType()
export class UpdateRoomInput {
  @Field(() => ID)
  @IsString()
  roomId: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;
}
