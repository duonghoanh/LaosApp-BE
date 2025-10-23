import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);

      // Parse mock token: "mock-token-{userId}"
      if (token.startsWith('mock-token-')) {
        const userId = token.replace('mock-token-', '');
        req['user'] = { id: userId };
      }
    }

    next();
  }
}
