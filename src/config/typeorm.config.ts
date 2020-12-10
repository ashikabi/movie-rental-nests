import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST ||'127.0.0.1',
  port:  process.env.DB_PORT? parseInt(process.env.DB_PORT) : 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '!nfinityWar2018',
  database: process.env.DB_NAME || 'movierental',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
}