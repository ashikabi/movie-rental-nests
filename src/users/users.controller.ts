import { Body, Controller, Get, Logger, Post, Query, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserCredentialsDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetToken, GetUser } from './decorators/token.decorator';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

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
  signout(@GetToken() accessToken: string){
    this.usersService.signout(accessToken)
  }

  @Post('/signup')
  signup(
    @Body(ValidationPipe) createUserDto: UserCredentialsDto
  ): Promise<Object>{
    return this.usersService.signup(createUserDto);
  }

  @Get('/confirm')
  confirmAccount(
    @Query('accessToken') accessToken: string
  ){
    this.usersService.confirmAccount(accessToken)
    return {message: "user is verified!!!"}
  }

  @Post('/update')
  @UseGuards(AuthGuard())
  updateUser(
    @GetToken() accessToken: string,
    @Body() updateUserDto: UpdateUserDto
    ){
      return this.usersService.updateUser(accessToken, updateUserDto)
    }

}
