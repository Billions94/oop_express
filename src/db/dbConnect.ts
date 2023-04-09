import { DataSource } from 'typeorm';
import ORMConfig from '../ormconfig';
import Logger from '../utils/log/logger';

export class DB {
  public static myDataSource = new DataSource(ORMConfig);
  static async connect(onError: Function, next?: Function): Promise<void> {
    try {
      await DB.init();
      if (next) {
        next();
      }
    } catch (e) {
      onError();
    }
  }

  static async init(): Promise<void> {
    try {
      await DB.myDataSource.connect();
      await DB.myDataSource.synchronize();
      console.log('Connected to database ✅');
    } catch (e) {
      Logger.error(e.message);
    }
  };
}