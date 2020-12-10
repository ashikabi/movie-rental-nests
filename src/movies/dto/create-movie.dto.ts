import { IsDecimal, IsInt, IsNotEmpty, IsOptional, Min } from "class-validator";

export class CreateMovieDto {

  @IsNotEmpty()
  title: string;

  @IsOptional()
  description: string;

  @IsNotEmpty()
  image: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  stock: number;

  @IsNotEmpty()
  @IsDecimal()
  rentalPrice: number;
  
  @IsNotEmpty()
  @IsDecimal()
  salePrice: number;

}