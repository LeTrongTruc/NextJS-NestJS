/* eslint-disable prettier/prettier */
import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
interface ExtendedRequest extends Request {
  user?: { id: number };
}

@Injectable()
export class MiddlewareOption implements NestMiddleware {
  constructor(private jwtService: JwtService) {}
  async use(req: ExtendedRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token) {
      try {
        const user = await this.jwtService.verifyAsync(token, {
          secret: process.env.JWT_SECRET,
        });
        req.user = user;
      } catch (error) {
        throw new UnauthorizedException();
      }
    }
    next();
  }
}
