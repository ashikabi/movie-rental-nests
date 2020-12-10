import { ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCredentialsDto } from './dto/create-user.dto';
import { JwtPayload } from './jwt-payload.interface';
import { User } from './user.entity';
import { UserRepository } from './user.repository';


@Injectable()
export class UsersService {
  private logger = new Logger('UsersService')
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwt: JwtService
  ){}

  async signin(credentials: UserCredentialsDto): Promise<{accessToken: string}>{
    const user: User = await this.userRepository.validateCredentials(credentials)

    if(!user){
      throw new UnauthorizedException("Invalid Credentials")
    }
    delete user.password;
    delete user.bcrypt;
    const payload: JwtPayload = {...user};
    const accessToken = await this.jwt.sign(payload)
    return {accessToken}

  }

  signout(){}

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
