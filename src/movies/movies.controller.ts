import { Body, Controller, Delete, Get, Logger, Param, ParseIntPipe, Patch, Post, Query, ValidationPipe } from '@nestjs/common';
import { Movie } from './movie.entity';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { FilterMovie } from './dto/filter-movie.dto';
import { PaginationDto } from './dto/pagination.dto';
import { Pagination } from 'nestjs-typeorm-paginate';

@Controller('movies')
export class MoviesController {
  private logger = new Logger('MoviesController')
  constructor(private moviesService: MoviesService){}

  @Get()
  getAllMovies(
    @Query() paginationDto: PaginationDto
  ): Promise<Pagination<Movie>>{
    return this.moviesService.getAllMovies(paginationDto);
  }

  @Get('/filterBy')
  getMoviesBy(
    @Query(ValidationPipe) filterMovie: FilterMovie
  ): Promise<Movie[]>{
    return this.moviesService.getMoviesBy(filterMovie);
  }

  @Get('/:id')
  getOneMovieById(@Param('id',ParseIntPipe) id: number): Promise<Movie>{
    return this.moviesService.getOneMovieById(id);
  }

  @Post()
  createMovie(
    @Body() createMovieDto: CreateMovieDto
  ): Promise<Movie>{
    return this.moviesService.createMovie(createMovieDto);
  }

  @Patch('/:id')
  updateMovie(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMovieDto: UpdateMovieDto
  ): Promise<Movie>{
    return this.moviesService.updateMovie(id, updateMovieDto);
  }

  @Patch('/:id')
  likeAMovie(){}

  @Delete('/:id')
  deleteMovie(
    @Param('id', ParseIntPipe) id: number
  ): Promise<void>{
    return this.moviesService.deleteMovie(id)
  }

}
