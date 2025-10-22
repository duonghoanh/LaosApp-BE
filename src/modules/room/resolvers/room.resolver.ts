import { Resolver, Mutation, Query, Args, ID } from '@nestjs/graphql';
import { RoomService } from '../services/room.service';
import { Room, Participant } from '../entities/room.entity';
import { CreateRoomInput } from '../dto/create-room.input';
import { JoinRoomInput } from '../dto/join-room.input';
import { UpdateRoomInput } from '../dto/update-room.input';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { RoomRole } from '../../../common/enums/room-role.enum';

@Resolver(() => Room)
export class RoomResolver {
  constructor(private readonly roomService: RoomService) {}

  @Mutation(() => Room)
  async createRoom(
    @CurrentUser() userId: string,
    @Args('input') input: CreateRoomInput,
  ): Promise<Room> {
    return this.roomService.createRoom(userId, input);
  }

  @Mutation(() => Room)
  async joinRoom(
    @CurrentUser() userId: string,
    @Args('input') input: JoinRoomInput,
  ): Promise<Room> {
    return this.roomService.joinRoom(userId, input);
  }

  @Mutation(() => Room)
  async leaveRoom(
    @CurrentUser() userId: string,
    @Args('roomId', { type: () => ID }) roomId: string,
  ): Promise<Room> {
    return this.roomService.leaveRoom(userId, roomId);
  }

  @Mutation(() => Room)
  async updateRoom(
    @CurrentUser() userId: string,
    @Args('input') input: UpdateRoomInput,
  ): Promise<Room> {
    return this.roomService.updateRoom(userId, input);
  }

  @Mutation(() => Room)
  async updateParticipantRole(
    @CurrentUser() hostId: string,
    @Args('roomId', { type: () => ID }) roomId: string,
    @Args('userId', { type: () => ID }) userId: string,
    @Args('role', { type: () => RoomRole }) role: RoomRole,
  ): Promise<Room> {
    return this.roomService.updateParticipantRole(hostId, roomId, userId, role);
  }

  @Mutation(() => Room)
  async closeRoom(
    @CurrentUser() hostId: string,
    @Args('roomId', { type: () => ID }) roomId: string,
  ): Promise<Room> {
    return this.roomService.closeRoom(hostId, roomId);
  }

  @Query(() => Room)
  async room(@Args('id', { type: () => ID }) id: string): Promise<Room> {
    return this.roomService.findById(id);
  }

  @Query(() => Room)
  async roomByCode(@Args('code') code: string): Promise<Room> {
    return this.roomService.findByCode(code);
  }

  @Query(() => [Room])
  async publicRooms(
    @Args('limit', { type: () => Number, nullable: true, defaultValue: 20 })
    limit: number,
    @Args('skip', { type: () => Number, nullable: true, defaultValue: 0 })
    skip: number,
  ): Promise<Room[]> {
    return this.roomService.getPublicRooms(limit, skip);
  }

  @Query(() => [Participant])
  async onlineParticipants(
    @Args('roomId', { type: () => ID }) roomId: string,
  ): Promise<Participant[]> {
    return this.roomService.getOnlineParticipants(roomId);
  }
}
