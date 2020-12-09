import { Module } from '@nestjs/common';
import { MoviesModule } from './movies/movies.module';
import { UsersModule } from './users/users.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [MoviesModule, UsersModule, TransactionsModule],
})
export class AppModule {}
