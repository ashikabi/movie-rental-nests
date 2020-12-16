import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserRepository } from './user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt/jwt.strategy';
import { ValidUserMiddleware } from 'src/commons/valid-user.middleware';
//import * as config from 'config'
import { IsSignedoutMiddleware } from '../movies/middlewares/is-signedout.middleware';

//const jwtConfig = config.get('jwt')
@Module({
  imports: [
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.register({
      secret: process.env.JWT_SECRET,// || jwtConfig.secret,
      signOptions: {
        expiresIn: parseInt(process.env.JWT_EXPIRATION),// || jwtConfig.expires
      }
    }),
    TypeOrmModule.forFeature([UserRepository])
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy],
  exports: [JwtStrategy, PassportModule]
})

export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(ValidUserMiddleware)
    .forRoutes({path: 'users/*', method: RequestMethod.PATCH})

    consumer
    .apply(IsSignedoutMiddleware)
    .forRoutes({path: 'users/*', method: RequestMethod.PATCH})
  

  }
}
