import 'reflect-metadata';
import express, { Express } from 'express';
import cors from 'cors';
import { DB } from './db/dbConnect';
import { Routes } from './route/routes';
import Requestlogger from './utils/log/RequestLogger';
import authGuard from './middlewares/authGuard';
import requireUser from './middlewares/requireUser';
import Logger from './utils/log/logger';
import { config } from 'dotenv';
import * as process from 'process';
import { Inject } from 'typescript-ioc';

config({ path: '.env' });
class App {
  private readonly server: Express;
  private readonly PORT = parseInt(<string>process.env.PORT);
  @Inject
  private readonly routes: Routes;

  constructor() {
    this.server = express();
    this.server.use(cors());
    this.server.use(express.json({ limit: '50mb' }));
    this.server.use(Requestlogger);
    this.connect();
    this.activateGuards();
    this.loadRoutes();
  }

  private connect(): void {
    this.server.use(async (req, res, next) => {
      await DB.connect(
        () =>
          res.send({
            error: 'Database connection error, please try again later',
          }),
        next
      );
    });

    this.server.listen(this.PORT, () => {
      Logger.info(`Server started on http://localhost:${this.PORT}`);
    });
  }

  private activateGuards(): void {
    this.server.use(authGuard);
    this.server.use(requireUser);
  }

  private loadRoutes(): void {
    this.routes.initialize(this.server);
  }
}

new App();
