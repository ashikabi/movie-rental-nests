import { TypeOrmModuleOptions } from "@nestjs/typeorm";
//import * as config from 'config'


//const dbConfig = config.get('db');

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',//dbConfig.type,
  host: process.env.MYSQL_HOST,
  port:  parseInt(process.env.MYSQL_PORT),
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
}