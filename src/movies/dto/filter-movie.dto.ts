import { IsBoolean, IsBooleanString, IsNotEmpty, IsOptional } from "class-validator";
import { MovieStatus } from '../movie-status.enum';

export class FilterMovie {
  
  @IsOptional()
  @IsNotEmpty()
  searchKey: string;

  @IsOptional()
  @IsBooleanString()
  availability: string;

  @IsOptional()
  @IsNotEmpty()
  status: MovieStatus;

}