import { EntityRepository, Repository } from "typeorm";
import { Movie } from './movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { MovieStatus } from "./movie-status.enum";
import { InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { UpdateMovieDto } from "./dto/update-movie.dto";
import { FilterMovie } from './dto/filter-movie.dto';
import { paginate, Pagination } from "nestjs-typeorm-paginate";

@EntityRepository(Movie)
export class MovieRepository extends Repository<Movie>{
  private logger = new Logger('MovieRepository');

  async findAll(page: number, limit: number): Promise<Pagination<Movie>>{   
    const query = this.createQueryBuilder('movie');
    query.where('movie.status != :status', {status: "D"});

    //const movies = await query.getMany();
    //return movies;
    return paginate<Movie>(query, {page, limit});
  }

  async createMovie(createMovieDto: CreateMovieDto): Promise<Movie>{
    const {title, description, image, stock, rentalPrice, salePrice} = createMovieDto;

    const movie = new Movie();
    movie.title = title;
    movie.description = description;
    movie.image = image;
    movie.stock = stock || 0;
    movie.rentalPrice = rentalPrice;
    movie.salePrice = salePrice;
    movie.availability = !!stock;
    movie.status = MovieStatus.ACTIVE;

    try{
      await movie.save();
    }catch(error){
      this.logger.error(error);
      throw new InternalServerErrorException();
    }

    return movie;
  }

  async updateMovie(id: number, updateMovieDto: UpdateMovieDto): Promise<Movie>{
    const {image, stock, rentalPrice, salePrice, availability, status} = updateMovieDto;
    const movie = await this.findOne({where : {id}})

    if(!movie)
      throw new NotFoundException(`Movie with ID : ${id} was not found!`);

    if(image)
      movie.image = image;
    
    if(stock)
      movie.stock = stock;
    
    if(rentalPrice)
      movie.rentalPrice = rentalPrice;

    if(salePrice)
      movie.salePrice = salePrice;

    if(availability)
      movie.availability = availability

    if(status)
      movie.status = status;

    await movie.save();
    return movie;
  }

  async getMoviesBy(filterMovie: FilterMovie): Promise<Movie[]>{
    const {searchKey, availability, status} = filterMovie
    const query = this.createQueryBuilder('movie');

    if(searchKey)
      query.andWhere('(movie.title LIKE :searchKey OR movie.description LIKE :searchKey)', {searchKey: `%${searchKey}%`});

    if(availability)
      query.andWhere('movie.availability = :availability', {availability});

    if(status)
      query.andWhere('movie.status = :status', {status});

    const movies = await query.getMany();
    return movies;

  }

}