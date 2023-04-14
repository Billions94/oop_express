import { DataSourceOptions } from 'typeorm';
import path from 'path';
import dotenv from 'dotenv';
import * as process from 'process';
dotenv.config()

const isCompiled = path.extname(__filename).includes('js');

export default {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(<string>process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: !process.env.DB_NO_LOGS,
  autoReconnect: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 2000,
  entities: [
    `src/user/entity/**/*.${isCompiled ? 'js' : 'ts'}`,
    `src/post/entity/**/*.${isCompiled ? 'js' : 'ts'}`,
    `src/spaces/entity/**/*.${isCompiled ? 'js' : 'ts'}`,
  ],
  migrations: [
    `src/migration/**/*.${isCompiled ? 'js' : 'ts'}`,
  ],
  cli: {
    'entitiesDir': 'src/user/entity',
    'migrationsDir': 'src/migration',
  },
} as DataSourceOptions;