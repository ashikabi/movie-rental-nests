import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieRepository } from './movie.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
//import * as config from 'config'
import { JwtStrategy } from 'src/users/jwt/jwt.strategy';
import { ValidUserMiddleware } from '../commons/valid-user.middleware';
import { UserRepository } from '../users/user.repository';
import { AnotherMiddlewareMiddleware } from './middlewares/another-middleware.middleware';

//const jwtConfig = config.get('jwt')
@Module({
  imports: [
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.register({
      secret: process.env.JWT_SECRET,// || jwtConfig.secret,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRATION,// || jwtConfig.expires
      }
    }),
    TypeOrmModule.forFeature([MovieRepository, UserRepository])
  ],
  controllers: [MoviesController],
  providers: [MoviesService, JwtStrategy],
  exports: [JwtStrategy, PassportModule]
})
export class MoviesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {

    consumer
    .apply(ValidUserMiddleware)
    .forRoutes({path: 'movies/*', method: RequestMethod.PATCH})

    consumer
    .apply(ValidUserMiddleware)
    .forRoutes({path: 'movies', method: RequestMethod.POST})

    consumer 
    .apply(AnotherMiddlewareMiddleware)
    .forRoutes({path: 'movies', method: RequestMethod.POST})

  }
}
