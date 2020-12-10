import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  private logger = new Logger('UsersController')
  constructor(private usersService: UsersService){}

  @Post('/signin')
  signin(){}

  @Post('/signout')
  signout(){}

  @Post('/signup')
  signup(
    @Body() createUserDto: CreateUserDto
  ): Promise<Object>{
    return this.usersService.signup(createUserDto);
  }

  @Post('/recovery')
  recoveryPassword(){}

  @Get('/confirm')
  confirmAccount(){}

  @Post('/update')
  updateUser(){}

}
