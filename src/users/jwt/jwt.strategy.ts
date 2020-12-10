import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRepository } from '../user.repository';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface';
import { User } from '../user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository
  ){
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'aa5e8c36-7f46-4de1-a7bb-58c8d4909762'
    })
  }

  async validate(payload: JwtPayload): Promise<User>{
    const {email} = payload;
    const user = await this.userRepository.findOne({email})
    

    if(!user)
      throw new UnauthorizedException("Invalid User");

    return user;
  }

}