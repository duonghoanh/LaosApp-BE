import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { SocketWithUser } from '../interfaces/socket-with-user.interface';

@Injectable()
export class WsAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient<SocketWithUser>();

    if (!client.user) {
      throw new WsException('Unauthorized');
    }

    return true;
  }
}
