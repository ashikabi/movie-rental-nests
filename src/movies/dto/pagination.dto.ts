import { IsInt, IsOptional, Min } from "class-validator";

export class PaginationDto {

  @IsOptional()
  @IsInt()
  page: number;

  @IsOptional()
  @IsInt()
  limit: number;
  
}