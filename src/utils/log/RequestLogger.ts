import { RequestHandler } from 'express';
import Logger from './logger';


const Requestlogger: RequestHandler = (req, res, next) => {
  Logger.info(`${req.method} request to http://localhost:3001${req.path}`);
  next();
};

export default Requestlogger;
