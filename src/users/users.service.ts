import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UsersService {
  private logger = new Logger('UsersService')
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository
  ){}

  signin(){}

  signout(){}

  async signup(createUserDto: CreateUserDto): Promise<Object>{
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
