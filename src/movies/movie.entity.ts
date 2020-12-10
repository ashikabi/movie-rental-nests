import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { MovieStatus } from './movie-status.enum';

@Entity()
export class Movie extends BaseEntity{

  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column()
  description: string;
  @Column()
  image: string;
  @Column({type : 'int'})
  stock: number;
  @Column({type : 'decimal', precision: 9, scale: 2})
  rentalPrice: number;
  @Column({type : 'decimal', precision: 9, scale: 2})
  salePrice: number;
  @Column({type: 'boolean'})
  availability: boolean;
  @Column()
  status: MovieStatus;


}