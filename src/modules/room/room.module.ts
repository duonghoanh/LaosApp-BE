import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Room, RoomSchema } from './entities/room.entity';
import { RoomService } from './services/room.service';
import { RoomResolver } from './resolvers/room.resolver';
import { RoomGateway } from './gateways/room.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
  ],
  providers: [RoomService, RoomResolver, RoomGateway],
  exports: [RoomService],
})
export class RoomModule {}
