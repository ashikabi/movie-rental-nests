import { Controller, Get, Logger, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  private logger = new Logger('UsersController')
  constructor(private usersService: UsersService){}

  @Post('/signin')
  signin(){}

  @Post('/signout')
  signout(){}

  @Post('/signup')
  signup(){}

  @Post('/recovery')
  recoveryPassword(){}

  @Get('/confirm')
  confirmAccount(){}

  @Post('/update')
  updateUser(){}

}
