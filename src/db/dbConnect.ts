import { DataSource } from 'typeorm';
import ORMConfig from '../ormconfig';
import Logger from '../utils/log/logger';

export class DB {
  public static myDataSource = new DataSource(ORMConfig);
  public static async connect(onError: Function, next?: Function): Promise<void> {
    try {
      await DB.init();
      if (next) {
        next();
      }
    } catch (e) {
      onError();
    }
  }

  private static async init(): Promise<void> {
    try {
      await DB.myDataSource.initialize();
      await DB.myDataSource.synchronize();
      Logger.info('Connected to database ✅');
    } catch (e) {
      Logger.error(e.message);
    }
  }
}
