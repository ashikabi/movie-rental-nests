import { Body, Controller, Get, Logger, Post, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserCredentialsDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  private logger = new Logger('UsersController')
  constructor(private usersService: UsersService){}

  @Post('/signin')
  signin(
    @Body(ValidationPipe) credentials: UserCredentialsDto
  ): Promise<{accessToken: string}>{
    return this.usersService.signin(credentials)
  }

  @Post('/signout')
  signout(){}

  @Post('/signup')
  signup(
    @Body(ValidationPipe) createUserDto: UserCredentialsDto
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
