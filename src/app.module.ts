import { Module } from '@nestjs/common';
import { MoviesModule } from './movies/movies.module';
import { UsersModule } from './users/users.module';
import { TransactionsModule } from './transactions/transactions.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { RedisModule} from 'nestjs-redis'
import * as config from 'config'

const redisConfig = config.get('redis');
@Module({
  imports: [MoviesModule, UsersModule, TransactionsModule, 
    RedisModule.register({
      host: process.env.REDIS_HOST || redisConfig.host,
      port: (process.env.REDIS_PORT? parseInt(process.env.REDIS_PORT): redisConfig.port),
    }),
    TypeOrmModule.forRoot(typeOrmConfig)],
})
export class AppModule {}
