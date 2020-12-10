import { Module } from '@nestjs/common';
import { MoviesModule } from './movies/movies.module';
import { UsersModule } from './users/users.module';
import { TransactionsModule } from './transactions/transactions.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { RedisModule} from 'nestjs-redis'

@Module({
  imports: [MoviesModule, UsersModule, TransactionsModule, AuthModule, 
    RedisModule.register({
      host: process.env.REDIS_HOST || "127.0.0.1",
      port: (process.env.REDIS_PORT? parseInt(process.env.REDIS_PORT): 6379),
    }),
    TypeOrmModule.forRoot(typeOrmConfig)],
})
export class AppModule {}
