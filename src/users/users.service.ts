import { ConflictException, Injectable, Logger, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCredentialsDto } from './dto/create-user.dto';
import { JwtPayload } from './jwt/jwt-payload.interface';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { RedisService } from 'nestjs-redis';
import { UserStatus } from './user-status.enum';
import * as nodemailer from 'nodemailer'


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

    if(user && user.status == UserStatus.PENDING)
      throw new UnauthorizedException("You need to verify the email")

    
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

    try{
      let result = await this.userRepository.signUp(createUserDto);
      await this.sendEmailVerificatrion(email, result);
      
      return {message: "User Created",
              detail: "Please verify your email...",};
    }catch(error){
      throw new InternalServerErrorException(error.message)
    }

  }

  recoveryPassword(){}

  confirmAccount(){}

  updateUser(){}

   async sendEmailVerificatrion(email: string, user: User): Promise<void>{

      console.log(user)
      
      delete user.password;
      delete user.bcrypt;
      const payload: JwtPayload = {...user};
      const accessToken = await this.jwt.sign(payload)

      const mailTransporter = nodemailer.createTransport({ 
        service: 'gmail', 
        auth: { 
            user: process.env.SMTP_USER || "movierental.nodemailer@gmail.com", 
            pass: process.env.SMTP_PASS || "!Password1234*"
        } 
      }); 

      const mailDetails = { 
        from: `"Movie Rental API" <${process.env.SMTP_USER || "movierental.nodemailer@gmail.com"}>`, 
        to: email,
        subject: "Confirm Account",
        html: `<p>Click <a href="http://localhost:3000/confirm?accessToken=${accessToken}">here</a> to confirm your account.</p>`,
      }; 

      mailTransporter.sendMail(mailDetails, (err, data)=> { 
        if(err)
          throw new InternalServerErrorException(err.message);
    })
    
  }

}
