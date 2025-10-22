import { Socket } from 'socket.io';

export interface SocketWithUser extends Socket {
  user?: {
    userId: string;
    nickname: string;
    roomId?: string;
  };
}
