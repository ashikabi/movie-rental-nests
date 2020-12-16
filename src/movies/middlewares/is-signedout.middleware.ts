import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { RedisService } from 'nestjs-redis';

@Injectable()
export class IsSignedoutMiddleware implements NestMiddleware {

  constructor(private redisService: RedisService){}

  async use(req: Request, res: Response, next: Function) {
    
    if(!req.headers.authorization)
      throw new UnauthorizedException("You are not loged in!");
    
    const accessToken = req.headers.authorization.split(" ")[1];
    const redisCli = this.redisService.getClient()
    const val = await redisCli.get("nestjs.validtokens")
    let validTokens = JSON.parse(val)

    if(!validTokens.find(t => t === accessToken))
      throw new UnauthorizedException("You are not loged in!");

    next();
  }
}
