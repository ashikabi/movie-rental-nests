import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieRepository } from './movie.repository';
import { Movie } from './movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MovieStatus } from './movie-status.enum';
import { FilterMovie } from './dto/filter-movie.dto';
import { PaginationDto } from './dto/pagination.dto';
import { Pagination } from 'nestjs-typeorm-paginate';

@Injectable()
export class MoviesService {

  constructor(
    @InjectRepository(MovieRepository)
    private movieRepository: MovieRepository
    ){}

  getAllMovies(paginationDto: PaginationDto): Promise<Pagination<Movie>>{
    let {page, limit} = paginationDto;
    if(!page)
      page = 1;
    
    if(!limit)
      limit = 0

    return this.movieRepository.findAll(page, limit);
  }

  getMoviesBy(filterMovie: FilterMovie): Promise<Movie[]>{
    return this.movieRepository.getMoviesBy(filterMovie);
  }

  getOneMovieById(id: number) : Promise<Movie>{
    const result =  this.movieRepository.findOne({where : {id}})

    if(!result)
      throw new NotFoundException(`Movie with ID : ${id} was not found!`);

    return result;
  }

  createMovie(createMovieDto: CreateMovieDto) : Promise<Movie>{
    return this.movieRepository.createMovie(createMovieDto);
  }

  updateMovie(id: number, updateMovieDto: UpdateMovieDto): Promise<Movie>{
    return this.movieRepository.updateMovie(id, updateMovieDto)
  }

  likeAMovie(){}

  async deleteMovie(id: number): Promise<void>{
    const movie = await this.movieRepository.findOne({where : {id}})

    if(!movie)
      throw new NotFoundException(`Movie with ID : ${id} was not found!`);

    movie.status = MovieStatus.DELETED
    movie.save();

  }

}
