import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  SpinHistory,
  SpinHistoryDocument,
} from '../entities/spin-history.entity';
import { GetHistoryInput } from '../dto/get-history.input';
import { RoomStatistics, SegmentStatistics } from '../dto/statistics.output';

@Injectable()
export class SpinHistoryService {
  constructor(
    @InjectModel(SpinHistory.name)
    private spinHistoryModel: Model<SpinHistoryDocument>,
  ) {}

  createSpinHistory(data: {
    roomId: string;
    wheelId: string;
    spinnerId: string;
    spinnerNickname: string;
    result: string;
    segmentId: string;
    seed: number;
    rotation: number;
  }): Promise<SpinHistory> {
    const spinHistory = new this.spinHistoryModel(data);
    return spinHistory.save();
  }

  async getHistory(getHistoryInput: GetHistoryInput): Promise<SpinHistory[]> {
    return this.spinHistoryModel
      .find({ roomId: getHistoryInput.roomId })
      .sort({ spunAt: -1 })
      .limit(getHistoryInput.limit || 50)
      .skip(getHistoryInput.skip || 0);
  }

  async getStatistics(roomId: string): Promise<RoomStatistics> {
    const history = await this.spinHistoryModel.find({ roomId });

    const totalSpins = history.length;
    const segmentCounts = new Map<string, { text: string; count: number }>();

    history.forEach((spin) => {
      const existing = segmentCounts.get(spin.segmentId);
      if (existing) {
        existing.count++;
      } else {
        segmentCounts.set(spin.segmentId, {
          text: spin.result,
          count: 1,
        });
      }
    });

    const segmentStats: SegmentStatistics[] = Array.from(
      segmentCounts.entries(),
    ).map(([segmentId, data]) => ({
      segmentId,
      text: data.text,
      count: data.count,
      percentage: totalSpins > 0 ? (data.count / totalSpins) * 100 : 0,
    }));

    const lastSpin = history.length > 0 ? history[0] : null;

    return {
      totalSpins,
      segmentStats,
      lastSpunAt: lastSpin?.spunAt,
    };
  }

  async getLastSpinByRoom(roomId: string): Promise<SpinHistory | null> {
    return this.spinHistoryModel.findOne({ roomId }).sort({ spunAt: -1 });
  }

  async clearHistory(roomId: string, _hostId: string): Promise<boolean> {
    await this.spinHistoryModel.deleteMany({ roomId });
    return true;
  }
}
