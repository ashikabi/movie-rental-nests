import { Module } from '@nestjs/common';
import { MoviesModule } from './movies/movies.module';
import { UsersModule } from './users/users.module';
import { TransactionsModule } from './transactions/transactions.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [MoviesModule, UsersModule, TransactionsModule, AuthModule],
})
export class AppModule {}
