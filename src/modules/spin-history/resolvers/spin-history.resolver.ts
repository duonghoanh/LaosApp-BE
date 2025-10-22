import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { SpinHistoryService } from '../services/spin-history.service';
import { SpinHistory } from '../entities/spin-history.entity';
import { GetHistoryInput } from '../dto/get-history.input';
import { RoomStatistics } from '../dto/statistics.output';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';

@Resolver(() => SpinHistory)
export class SpinHistoryResolver {
  constructor(private readonly spinHistoryService: SpinHistoryService) {}

  @Query(() => [SpinHistory])
  async spinHistory(
    @Args('input') input: GetHistoryInput,
  ): Promise<SpinHistory[]> {
    return this.spinHistoryService.getHistory(input);
  }

  @Query(() => RoomStatistics)
  async roomStatistics(
    @Args('roomId', { type: () => ID }) roomId: string,
  ): Promise<RoomStatistics> {
    return this.spinHistoryService.getStatistics(roomId);
  }

  @Query(() => SpinHistory, { nullable: true })
  async lastSpin(
    @Args('roomId', { type: () => ID }) roomId: string,
  ): Promise<SpinHistory | null> {
    return this.spinHistoryService.getLastSpinByRoom(roomId);
  }

  @Mutation(() => Boolean)
  async clearHistory(
    @CurrentUser() hostId: string,
    @Args('roomId', { type: () => ID }) roomId: string,
  ): Promise<boolean> {
    return this.spinHistoryService.clearHistory(roomId, hostId);
  }
}
