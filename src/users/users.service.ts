import { ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCredentialsDto } from './dto/create-user.dto';
import { JwtPayload } from './jwt/jwt-payload.interface';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { RedisService } from 'nestjs-redis';


@Injectable()
export class UsersService {
  private logger = new Logger('UsersService')
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwt: JwtService,
    private redisService: RedisService,
  ){}

  async signin(credentials: UserCredentialsDto): Promise<{accessToken: string}>{
    let user: User = await this.userRepository.validateCredentials(credentials)

    if(!user){
      throw new UnauthorizedException("Invalid Credentials")
    }
    delete user.password;
    delete user.bcrypt;
    const payload: JwtPayload = {...user};
    const accessToken = await this.jwt.sign(payload)

    const redisCli = await this.redisService.getClient()
    const val = await redisCli.get("nestjs.validtokens")
    const validTokens = JSON.parse(val) || []

    validTokens.push(accessToken)
    await redisCli.set("nestjs.validtokens", JSON.stringify(validTokens))
    
    return {accessToken}

  }

  async signout(accessToken: string){
    const redisCli = await this.redisService.getClient()
    let val = await redisCli.get("nestjs.validtokens")
    let validTokens = JSON.parse(val)

    validTokens = validTokens.filter(t => t!== accessToken)
    await redisCli.set("nestjs.validtokens", JSON.stringify(validTokens))
  }

  async signup(createUserDto: UserCredentialsDto): Promise<Object>{
    const {email} = createUserDto;
    const user = await this.userRepository.findOne({where: {email}})
    if(user)
      throw new ConflictException(`There is already a user with the email: ${email}`)

    return this.userRepository.signUp(createUserDto);
  }

  recoveryPassword(){}

  confirmAccount(){}

  updateUser(){}

}
