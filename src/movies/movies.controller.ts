import { Controller, Delete, Get, Logger, Patch, Post } from '@nestjs/common';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  private logger = new Logger('MoviesController')

  constructor(private moviesService: MoviesService){}

  @Get()
  getAllMovies(){
    return this.moviesService.getAllMovies();
  }

  @Get('/filterBy')
  getMoviesBy(){}

  @Get('/:id')
  getOneMovieById(){}

  @Post()
  createMovie(){}

  @Patch('/:id')
  updateMovie(){}

  @Patch('/:id')
  likeAMovie(){}

  @Delete('/:id')
  deleteMovie(){}

}
