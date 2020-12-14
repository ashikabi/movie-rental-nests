import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import * as config from 'config'

const dbConfig = config.get('db');

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: dbConfig.type,
  host: process.env.MYSQL_HOST || dbConfig.host,
  port:  process.env.MYSQL_PORT? parseInt(process.env.MYSQL_PORT) : dbConfig.port,
  username: process.env.DB_USER || dbConfig.user,
  password: process.env.MYSQL_ROOT_PASSWORD || dbConfig.password,
  database: process.env.MYSQL_DATABASE || dbConfig.database,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
}