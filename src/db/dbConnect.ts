import { DataSource } from 'typeorm';
import ORMConfig from '../ormConfig';
import Logger from '../utils/log/Logger';

export class DB {
  public static dataSource = new DataSource(ORMConfig);
  public static async connect(): Promise<void> {
    try {
      if (!DB.dataSource.isInitialized) {
        await DB.dataSource.initialize();
        await DB.dataSource.synchronize();
        Logger.info('Connected to database ✅');
      }
    } catch (e) {
      Logger.error(e.message);
    }
  }
}
