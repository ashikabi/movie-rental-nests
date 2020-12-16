import { NestFactory } from '@nestjs/core';
import { Logger, Post } from '@nestjs/common';
import { AppModule } from './app.module';
//import * as config from 'config'

//const serverConfig = config.get('server')

async function bootstrap() {
  const logger = new Logger('main')
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.APP_PORT);
  logger.debug(`Application Running on port ${process.env.APP_PORT}`);
}
bootstrap();
