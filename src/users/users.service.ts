import { ConflictException, Injectable, Logger, UnauthorizedException, InternalServerErrorException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCredentialsDto } from './dto/create-user.dto';
import { JwtPayload } from './jwt/jwt-payload.interface';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { RedisService } from 'nestjs-redis';
import { UserStatus } from './user-status.enum';
import * as nodemailer from 'nodemailer'
//import * as config from 'config'
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from './dto/user-role.enum';

//const emailConfig = config.get('mail')
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
    const accessToken = this.jwt.sign(payload)

    const redisCli = this.redisService.getClient()
    const val = await redisCli.get("nestjs.validtokens")
    const validTokens = JSON.parse(val) || []

    validTokens.push(accessToken)
    await redisCli.set("nestjs.validtokens", JSON.stringify(validTokens))
    
    return {accessToken}

  }

  async signout(accessToken: string){
    const redisCli = this.redisService.getClient()
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
      await this.sendEmail("VERIFICATION" , email, result);
      
      return {message: "User Created",
              detail: "Please verify your email...",};
    }catch(error){
      throw new InternalServerErrorException(error.message)
    }

  }

  async confirmAccount(accessToken: string):Promise<void>{
    const rst = await this.jwt.decode(accessToken);
    const row = await this.userRepository.findOne({where : {email: rst["email"]}})
    row.status = UserStatus.ACTIVE;
    await row.save()
  }

  async updateUser(id: number,accessToken: string, updateUserDto: UpdateUserDto){
    const {email, role} = updateUserDto;
    const rst = await this.jwt.decode(accessToken);

    if(rst && rst["role"] !== UserRole.ADMIN)
      throw new ForbiddenException("Only Admin Users can update a user");

    const user = await this.userRepository.findOne({where: {id}})

    if(!user)
      throw new NotFoundException(`User : ${email} not found!`);

    user.role = role;
    await user.save()


  }

   async sendEmail(type: string,email: string, user: User): Promise<void>{

    const mailTransporter = nodemailer.createTransport({ 
      service: 'gmail',//emailConfig.type, 
      auth: { 
          user: process.env.SMTP_USER,// || emailConfig.account, 
          pass: process.env.SMTP_PASS// || emailConfig.password
      } 
    }); 

      let subject = ""
      let html = ""
      if(type === "VERIFICATION"){
        delete user.password;
        delete user.bcrypt;
        const payload: JwtPayload = {...user};
        const accessToken = this.jwt.sign(payload)
        subject = "Confirm Account"
        html = `<p>Click <a href="http://localhost:3000/users/confirm?accessToken=${accessToken}">here</a> to confirm your account.</p>`
      }

      const mailDetails = { 
        from: `"Movie Rental API" <${process.env.SMTP_USER}>`, 
        to: email,
        subject,
        html,
      }; 

      mailTransporter.sendMail(mailDetails, (err, data)=> { 
        if(err)
          throw new InternalServerErrorException(err.message);
    })
    
  }

}
