import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CreateWheelInput } from './create-wheel.input';

@InputType()
export class UpdateWheelInput extends PartialType(CreateWheelInput) {
  @Field(() => ID)
  @IsString()
  wheelId: string;
}
