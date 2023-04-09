import { DataSourceOptions } from 'typeorm';
import path from 'path';

const isCompiled = path.extname(__filename).includes('js');

export default {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'testdb',
  synchronize: !process.env.DB_NO_SYNC,
  logging: !process.env.DB_NO_LOGS,
  autoReconnect: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 2000,
  entities: [
    `src/user/entity/**/*.${isCompiled ? 'js' : 'ts'}`,
  ],
  migrations: [
    `src/migration/**/*.${isCompiled ? 'js' : 'ts'}`,
  ],
  cli: {
    'entitiesDir': 'src/user/entity',
    'migrationsDir': 'src/migration',
  },
} as DataSourceOptions;