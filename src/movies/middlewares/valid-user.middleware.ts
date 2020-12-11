import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '../../users/dto/user-role.enum';

@Injectable()
export class ValidUserMiddleware implements NestMiddleware {
  constructor(
    private jwt: JwtService
  ){}
  async use(req: Request, res: Response, next: Function) {
    const accessToken = req.headers.authorization.split(" ")[1]
    const rst = await this.jwt.decode(accessToken);
    if(rst && rst["role"] !== UserRole.ADMIN)
      throw new ForbiddenException("Only Admin Users are allowed");

    next();
  }
}
