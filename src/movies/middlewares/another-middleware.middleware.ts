import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class AnotherMiddlewareMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    console.log('Work in progress Another Middleware Before Creating a new entry...');
    next();
  }
}
