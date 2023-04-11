import 'reflect-metadata';
import express, { Express } from 'express';
import cors from 'cors';
import { UserController } from './user/controller/userController';
import { DB } from './db/dbConnect';
import * as process from 'process';
import Requestlogger from './utils/log/RequestLogger';
import Logger from './utils/log/logger';
import authGuard from './middlewares/authGuard';
import requireUser from './middlewares/requireUser';
import { PostController } from './post/controller/postController';
import { Container } from 'typedi';
import { Routes } from './route/routes';

class App {
  private readonly server: Express;
  private readonly PORT = parseInt(<string>process.env.PORT) || 3030;

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
          res.send(
            { error: 'Database connection error, please try again later' },
          ),
        next,
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
    new Routes(this.server).initialize();
  }
}

new App();
