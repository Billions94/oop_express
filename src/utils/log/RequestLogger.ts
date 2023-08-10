import { RequestHandler } from 'express';
import dotenv from 'dotenv';
import * as process from 'process';
import Logger from './Logger';
dotenv.config();

const Requestlogger: RequestHandler = (req, res, next) => {
  Logger.info(
    process.env.NODE_ENV === 'production'
      ? `${req.method} request to ${process.env.PROD_URL}${req.path}`
      : `${req.method} request to ${process.env.LOCAL_URL}${req.path}`
  );
  next();
};

export default Requestlogger;
