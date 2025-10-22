import { Resolver, Mutation, Query, Args, ID } from '@nestjs/graphql';
import { WheelService } from '../services/wheel.service';
import { Wheel } from '../entities/wheel.entity';
import { CreateWheelInput, UpdateWheelInput } from '../dto/create-wheel.input';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';

@Resolver(() => Wheel)
export class WheelResolver {
  constructor(private readonly wheelService: WheelService) {}

  @Mutation(() => Wheel)
  async createWheel(
    @CurrentUser() userId: string,
    @Args('input') input: CreateWheelInput,
  ): Promise<Wheel> {
    return this.wheelService.createWheel(userId, input);
  }

  @Mutation(() => Wheel)
  async updateWheel(
    @CurrentUser() userId: string,
    @Args('input') input: UpdateWheelInput,
  ): Promise<Wheel> {
    return this.wheelService.updateWheel(userId, input);
  }

  @Mutation(() => Boolean)
  async deleteWheel(
    @CurrentUser() userId: string,
    @Args('wheelId', { type: () => ID }) wheelId: string,
  ): Promise<boolean> {
    return this.wheelService.deleteWheel(userId, wheelId);
  }

  @Query(() => Wheel)
  async wheel(@Args('id', { type: () => ID }) id: string): Promise<Wheel> {
    return this.wheelService.findById(id);
  }

  @Query(() => Wheel)
  async wheelByRoom(
    @Args('roomId', { type: () => ID }) roomId: string,
  ): Promise<Wheel> {
    return this.wheelService.findByRoomId(roomId);
  }
}
