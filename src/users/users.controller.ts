import { Body, Controller, Get, Logger, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserCredentialsDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  private logger = new Logger('UsersController')
  constructor(
    private usersService: UsersService,
    ){}

  @Post('/signin')
  signin(
    @Body(ValidationPipe) credentials: UserCredentialsDto
  ): Promise<{accessToken: string}>{
    return this.usersService.signin(credentials)
  }

  @Post('/signout')
  @UseGuards(AuthGuard())
  signout(@Req() req){
    const currentToken = req.headers.authorization.split(" ")[1];
    this.usersService.signout(currentToken)
  }

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
