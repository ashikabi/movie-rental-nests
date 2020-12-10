import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRole } from './dto/user-role.enum';
import { UserStatus } from './user-status.enum';
import { InternalServerErrorException, Logger } from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User>{
  private logger = new Logger('UserRepository')
  async signUp(createUserDto: CreateUserDto): Promise<Object>{
    const {email, password} = createUserDto;
    const user = new User()

    user.email = email;
    user.password = password;
    user.role = UserRole.USER;
    user.status = UserStatus.PENDING;

    try{
      await user.save();
    }catch(error){
      this.logger.error(error);
      throw new InternalServerErrorException();
    }

    return {message: "User Created",
            detail: "Please verify your email..."}

  }

} 