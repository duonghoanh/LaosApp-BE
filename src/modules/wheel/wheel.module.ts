import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Wheel, WheelSchema } from './entities/wheel.entity';
import { WheelService } from './services/wheel.service';
import { WheelResolver } from './resolvers/wheel.resolver';
import { WheelGateway } from './gateways/wheel.gateway';
import { RoomModule } from '../room/room.module';
import { SpinHistoryModule } from '../spin-history/spin-history.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Wheel.name, schema: WheelSchema }]),
    RoomModule,
    SpinHistoryModule,
  ],
  providers: [WheelService, WheelResolver, WheelGateway],
  exports: [WheelService],
})
export class WheelModule {}
