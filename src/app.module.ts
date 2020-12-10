import { Module } from '@nestjs/common';
import { MoviesModule } from './movies/movies.module';
import { UsersModule } from './users/users.module';
import { TransactionsModule } from './transactions/transactions.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';


@Module({
  imports: [MoviesModule, UsersModule, TransactionsModule, AuthModule, 
    TypeOrmModule.forRoot(typeOrmConfig)],
})
export class AppModule {}
