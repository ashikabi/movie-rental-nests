import { Injectable, NestMiddleware, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '../users/dto/user-role.enum';

@Injectable()
export class ValidUserMiddleware implements NestMiddleware {
  constructor(
    private jwt: JwtService
  ){}
  async use(req: Request, res: Response, next: Function) {
    if(!req.headers.authorization)
      throw new UnauthorizedException("You are not loged in!");

    const accessToken = req.headers.authorization.split(" ")[1]
    console.log(accessToken)
    const rst = await this.jwt.decode(accessToken);
    
    console.log(rst["role"])

    if(rst && rst["role"] !== UserRole.ADMIN)
      throw new ForbiddenException("Only Admin Users are allowed");

    next();
  }
}
