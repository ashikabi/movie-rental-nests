import { IsEmail, IsIn, IsNotEmpty, IsOptional } from "class-validator";
import { UserRole } from './user-role.enum';
import { UserStatus } from '../user-status.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsIn([UserRole.ADMIN, UserRole.USER])
  role: string;

}