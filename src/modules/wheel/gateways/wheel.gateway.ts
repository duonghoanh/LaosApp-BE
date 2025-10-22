import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { WheelService } from '../services/wheel.service';
import { SpinHistoryService } from '../../spin-history/services/spin-history.service';
import { SocketWithUser } from '../../../common/interfaces/socket-with-user.interface';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'wheel',
})
export class WheelGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly wheelService: WheelService,
    private readonly spinHistoryService: SpinHistoryService,
  ) {}

  @SubscribeMessage('spin')
  async handleSpin(
    @ConnectedSocket() client: SocketWithUser,
    @MessageBody()
    data: {
      roomId: string;
      wheelId: string;
      seed: number;
      spinnerNickname: string;
    },
  ) {
    const { roomId, wheelId, seed, spinnerNickname } = data;

    // Get wheel data
    const wheel = await this.wheelService.findById(wheelId);

    // Calculate result
    const { winner, rotation } = this.wheelService.calculateSpinResult(
      seed,
      wheel.segments,
    );

    // Save to history
    const spinHistory = await this.spinHistoryService.createSpinHistory({
      roomId,
      wheelId,
      spinnerId: client.user?.userId || 'anonymous',
      spinnerNickname,
      result: winner.text,
      segmentId: winner.id,
      seed,
      rotation,
    });

    // Broadcast to all clients in room
    this.server.to(roomId).emit('spinStarted', {
      spinId: spinHistory._id,
      seed,
      rotation,
      spinDuration: wheel.spinDuration,
      spinnerNickname,
      timestamp: new Date(),
    });

    // Emit result after spin duration
    setTimeout(() => {
      this.server.to(roomId).emit('spinResult', {
        spinId: spinHistory._id,
        winner,
        rotation,
        spinnerNickname,
        timestamp: new Date(),
      });
    }, wheel.spinDuration);

    return {
      success: true,
      spinId: spinHistory._id,
      winner,
      rotation,
    };
  }

  @SubscribeMessage('joinWheelRoom')
  async handleJoinWheelRoom(
    @ConnectedSocket() client: SocketWithUser,
    @MessageBody() data: { roomId: string },
  ) {
    await client.join(data.roomId);
    return { success: true };
  }

  emitWheelUpdate(roomId: string, wheel: unknown) {
    this.server.to(roomId).emit('wheelUpdated', wheel);
  }
}
