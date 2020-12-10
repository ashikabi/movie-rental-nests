import { IsEmail, IsString, Max, Min } from "class-validator";

export class CreateUserDto {
  
  @IsEmail()
  email: string;
  @IsString()
  @Min(8)
  @Max(20)
  password: string;
  
}