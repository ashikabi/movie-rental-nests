import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common'
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('main')
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.APP_PORT || 3000);
  logger.debug(`Application Running on port ${process.env.APP_PORT || 3000}`);
}
bootstrap();
