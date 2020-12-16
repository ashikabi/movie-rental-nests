import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { User } from '../user.entity';

export const GetUser = createParamDecorator((data, ctx: ExecutionContext): User => {
  const req = ctx.switchToHttp().getRequest();
  return req.user;
});

export const GetToken = createParamDecorator((data, ctx: ExecutionContext): String => {
  console.log("GetToken Decorator")
  const req = ctx.switchToHttp().getRequest();
  return req.headers.authorization.split(" ")[1];
});