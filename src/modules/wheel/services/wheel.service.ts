import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Wheel, WheelDocument, WheelSegment } from '../entities/wheel.entity';
import { CreateWheelInput, UpdateWheelInput } from '../dto/create-wheel.input';
import { RoomService } from '../../room/services/room.service';

@Injectable()
export class WheelService {
  constructor(
    @InjectModel(Wheel.name) private wheelModel: Model<WheelDocument>,
    private roomService: RoomService,
  ) {}

  async createWheel(
    userId: string,
    createWheelInput: CreateWheelInput,
  ): Promise<Wheel> {
    // Verify user is host
    const room = await this.roomService.findById(createWheelInput.roomId);
    if (room.hostId !== userId) {
      throw new ForbiddenException('Only host can create wheel');
    }

    // Generate IDs for segments
    const segments = createWheelInput.segments.map((seg) => ({
      ...seg,
      id: uuidv4(),
    }));

    const wheel = new this.wheelModel({
      roomId: createWheelInput.roomId,
      title: createWheelInput.title,
      segments,
      spinDuration: createWheelInput.spinDuration || 5000,
      soundEnabled: createWheelInput.soundEnabled ?? true,
      confettiEnabled: createWheelInput.confettiEnabled ?? true,
    });

    return wheel.save();
  }

  async findById(wheelId: string): Promise<WheelDocument> {
    const wheel = await this.wheelModel.findById(wheelId);
    if (!wheel) {
      throw new NotFoundException('Wheel not found');
    }
    return wheel;
  }

  async findByRoomId(roomId: string): Promise<WheelDocument> {
    const wheel = await this.wheelModel
      .findOne({ roomId })
      .sort({ createdAt: -1 });
    if (!wheel) {
      throw new NotFoundException('No wheel found for this room');
    }
    return wheel;
  }

  async updateWheel(
    userId: string,
    updateWheelInput: UpdateWheelInput,
  ): Promise<Wheel> {
    const wheel = await this.findById(updateWheelInput.wheelId);
    const room = await this.roomService.findById(wheel.roomId);

    // Only host can update
    if (room.hostId !== userId) {
      throw new ForbiddenException('Only host can update wheel');
    }

    if (updateWheelInput.title) {
      wheel.title = updateWheelInput.title;
    }

    if (updateWheelInput.segments) {
      wheel.segments = updateWheelInput.segments.map((seg) => ({
        ...seg,
        id: seg.id || uuidv4(),
      })) as WheelSegment[];
    }

    if (updateWheelInput.spinDuration) {
      wheel.spinDuration = updateWheelInput.spinDuration;
    }

    if (updateWheelInput.soundEnabled !== undefined) {
      wheel.soundEnabled = updateWheelInput.soundEnabled;
    }

    if (updateWheelInput.confettiEnabled !== undefined) {
      wheel.confettiEnabled = updateWheelInput.confettiEnabled;
    }

    return wheel.save();
  }

  // Calculate spin result based on seed and weights
  calculateSpinResult(
    seed: number,
    segments: WheelSegment[],
  ): { winner: WheelSegment; rotation: number } {
    // Seeded random function
    const seededRandom = (seed: number) => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    // Calculate total weight
    const totalWeight = segments.reduce((sum, seg) => sum + seg.weight, 0);

    // Pick winner based on weighted random
    let random = seededRandom(seed) * totalWeight;
    let winnerIndex = 0;

    for (let i = 0; i < segments.length; i++) {
      random -= segments[i].weight;
      if (random <= 0) {
        winnerIndex = i;
        break;
      }
    }

    const winner = segments[winnerIndex];

    // Calculate rotation (multiple full rotations + final position)
    const degreesPerSegment = 360 / segments.length;
    const winnerAngle = winnerIndex * degreesPerSegment;
    const extraRotations = 5 + Math.floor(seededRandom(seed + 1) * 3); // 5-7 full rotations
    const rotation = extraRotations * 360 + winnerAngle;

    return { winner, rotation };
  }

  async deleteWheel(userId: string, wheelId: string): Promise<boolean> {
    const wheel = await this.findById(wheelId);
    const room = await this.roomService.findById(wheel.roomId);

    if (room.hostId !== userId) {
      throw new ForbiddenException('Only host can delete wheel');
    }

    await this.wheelModel.findByIdAndDelete(wheelId);
    return true;
  }
}
