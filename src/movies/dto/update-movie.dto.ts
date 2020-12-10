import { IsBoolean, IsDecimal, IsIn, IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';
import { MovieStatus } from '../movie-status.enum';
export class UpdateMovieDto {
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

  @IsOptional()
  @IsBoolean()
  availability: boolean;

  @IsOptional()
  @IsIn([MovieStatus.ACTIVE,MovieStatus.DELETED,MovieStatus.REMOVED])
  status: MovieStatus;

}