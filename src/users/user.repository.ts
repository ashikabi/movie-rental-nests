import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { UserCredentialsDto } from './dto/create-user.dto';
import { UserRole } from './dto/user-role.enum';
import { UserStatus } from './user-status.enum';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import * as bcrypt from 'bcryptjs'

@EntityRepository(User)
export class UserRepository extends Repository<User>{
  private logger = new Logger('UserRepository')
  async signUp(createUserDto: UserCredentialsDto): Promise<User>{
    const {email, password} = createUserDto;
    const user = new User()
    const jump = await bcrypt.genSalt()

    user.email = email;
    user.password = await bcrypt.hash(password,jump)//password;
    user.role = UserRole.USER;
    user.status = UserStatus.PENDING;
    user.bcrypt = jump;

    try{
      const newUser = await user.save();
      return newUser
    }catch(error){
      this.logger.error(error);
      throw new InternalServerErrorException();
    }

  }

  async validateCredentials(credentials: UserCredentialsDto):Promise<User>{
    const {email, password} = credentials;

    const user = await this.findOne({email})

    if(user && await user.validatePassword(password))
      return user;
    else
      return null;

  }

} 