import 'reflect-metadata';
import * as http from 'http';
import express, { Express } from 'express';
import cors from 'cors';
import { DB } from './db/dbConnect';
import { Routes } from './route/routes';
import Requestlogger from './utils/log/RequestLogger';
import { AuthGuard } from './middlewares/authGuard';
import Logger from './utils/log/logger';
import { config } from 'dotenv';
import * as process from 'process';
import { Inject } from 'typescript-ioc';
import { SocketServer } from './socket/socket';
import { RequireUserAuth } from './middlewares/requireUser';

config({ path: '.env' });
class App {
  @Inject
  private readonly routes: Routes;
  private readonly server: Express;
  private readonly httpServer;
  private readonly PORT = parseInt(String(process.env.PORT));
  @Inject
  private readonly authGuard: AuthGuard;
  @Inject
  private readonly requireUser: RequireUserAuth;

  constructor() {
    this.server = express();
    this.httpServer = http.createServer(this.server);
    this.server.use(cors({ origin: '*' }));
    this.server.use(express.json({ limit: '50mb' }));
    this.server.use(Requestlogger);
    this.initializeSocketServer();
    this.connect();
    this.activateGuards();
    this.loadRoutes();
  }

  private initializeSocketServer() {
    new SocketServer(this.httpServer);
  }

  private connect(): void {
    (async () => await DB.connect())();

    this.server.listen(this.PORT, () => {
      Logger.info(
        process.env.NODE_ENV === 'production'
          ? `Server started on https://com2gether.onrender.com`
          : `Server started on http://localhost:${this.PORT}`
      );
    });
  }

  private activateGuards(): void {
    this.server.use(this.authGuard.init);
    this.server.use(this.requireUser.init);
  }

  private loadRoutes(): void {
    this.routes.initialize(this.server);
  }
}

new App();
