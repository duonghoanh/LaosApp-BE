import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Room, RoomDocument, Participant } from '../entities/room.entity';
import { CreateRoomInput } from '../dto/create-room.input';
import { JoinRoomInput } from '../dto/join-room.input';
import { UpdateRoomInput } from '../dto/update-room.input';
import {
  RoomRole,
  ParticipantStatus,
} from '../../../common/enums/room-role.enum';

@Injectable()
export class RoomService {
  constructor(@InjectModel(Room.name) private roomModel: Model<RoomDocument>) {}

  // Generate unique 6-character room code
  private generateRoomCode(): string {
    return uuidv4().substring(0, 6).toUpperCase();
  }

  async createRoom(
    hostId: string,
    createRoomInput: CreateRoomInput,
  ): Promise<Room> {
    const code = this.generateRoomCode();

    const hostParticipant: Participant = {
      userId: hostId,
      nickname: 'Host', // Will be updated when user joins
      role: RoomRole.HOST,
      status: ParticipantStatus.ONLINE,
      joinedAt: new Date(),
    };

    const room = new this.roomModel({
      code,
      name: createRoomInput.name,
      description: createRoomInput.description,
      hostId,
      participants: [hostParticipant],
      isPublic: createRoomInput.isPublic || false,
      maxParticipants: createRoomInput.maxParticipants,
      password: createRoomInput.password,
      isActive: true,
    });

    return room.save();
  }

  async findByCode(code: string): Promise<RoomDocument> {
    const room = await this.roomModel.findOne({ code, isActive: true });
    if (!room) {
      throw new NotFoundException('Room not found');
    }
    return room;
  }

  async findById(roomId: string): Promise<RoomDocument> {
    const room = await this.roomModel.findById(roomId);
    if (!room) {
      throw new NotFoundException('Room not found');
    }
    return room;
  }

  async joinRoom(userId: string, joinRoomInput: JoinRoomInput): Promise<Room> {
    const room = await this.findByCode(joinRoomInput.code);

    // Check password if room is private
    if (!room.isPublic && room.password !== joinRoomInput.password) {
      throw new ForbiddenException('Incorrect password');
    }

    // Check if user already in room
    const existingParticipant = room.participants.find(
      (p) => p.userId === userId,
    );

    if (existingParticipant) {
      // Update status to online
      existingParticipant.status = ParticipantStatus.ONLINE;
      existingParticipant.lastSeenAt = new Date();
    } else {
      // Check max participants
      if (
        room.maxParticipants &&
        room.participants.length >= room.maxParticipants
      ) {
        throw new BadRequestException('Room is full');
      }

      // Add new participant
      const newParticipant: Participant = {
        userId,
        nickname: joinRoomInput.nickname,
        role: RoomRole.PLAYER,
        status: ParticipantStatus.ONLINE,
        joinedAt: new Date(),
      };

      room.participants.push(newParticipant);
    }

    return room.save();
  }

  async leaveRoom(userId: string, roomId: string): Promise<Room> {
    const room = await this.findById(roomId);

    const participant = room.participants.find((p) => p.userId === userId);
    if (participant) {
      participant.status = ParticipantStatus.OFFLINE;
      participant.lastSeenAt = new Date();
    }

    return room.save();
  }

  async updateRoom(
    userId: string,
    updateRoomInput: UpdateRoomInput,
  ): Promise<Room> {
    const room = await this.findById(updateRoomInput.roomId);

    // Only host can update
    if (room.hostId !== userId) {
      throw new ForbiddenException('Only host can update room');
    }

    if (updateRoomInput.name) {
      room.name = updateRoomInput.name;
    }

    if (updateRoomInput.description !== undefined) {
      room.description = updateRoomInput.description;
    }

    return room.save();
  }

  async updateParticipantRole(
    hostId: string,
    roomId: string,
    userId: string,
    role: RoomRole,
  ): Promise<Room> {
    const room = await this.findById(roomId);

    if (room.hostId !== hostId) {
      throw new ForbiddenException('Only host can change roles');
    }

    const participant = room.participants.find((p) => p.userId === userId);
    if (!participant) {
      throw new NotFoundException('Participant not found');
    }

    participant.role = role;
    return room.save();
  }

  async getOnlineParticipants(roomId: string): Promise<Participant[]> {
    const room = await this.findById(roomId);
    return room.participants.filter(
      (p) => p.status === ParticipantStatus.ONLINE,
    );
  }

  async getPublicRooms(limit = 20, skip = 0): Promise<Room[]> {
    return this.roomModel
      .find({ isPublic: true, isActive: true })
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });
  }

  async closeRoom(hostId: string, roomId: string): Promise<Room> {
    const room = await this.findById(roomId);

    if (room.hostId !== hostId) {
      throw new ForbiddenException('Only host can close room');
    }

    room.isActive = false;
    return room.save();
  }
}
