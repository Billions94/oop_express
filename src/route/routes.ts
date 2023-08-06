import { Express, Router } from 'express';
import { UserController } from '../user/controller/userController';
import { PostController } from '../post/controller/postController';
import { SpaceController } from '../space/controller/spaceController';
import { Server } from 'typescript-rest';
import { Inject } from 'typescript-ioc';
import { Health } from '../health/health';
import listEndpoints from 'express-list-endpoints';
import { MessageController } from '../message/controller/messageController';

/**
 * Class for handling routers and controllers
 */
export class Routes {
  @Inject
  private readonly userController: UserController;
  @Inject
  private readonly postController: PostController;
  @Inject
  private readonly spaceController: SpaceController;
  @Inject
  private readonly messageController: MessageController;
  @Inject
  private readonly healthCheck: Health;

  /**
   * @remarks This is a custom method.
   * Creates routes for all classes we annotate with decorators from typescript-rest
   * and utilizes all controllers specified in the patterns param in the loadControllers method
   * @param server - Express Application Server.
   * @returns A of type of void.
   * @beta
   */
  initialize(server: Express): void {
    const router = Router();
    Server.buildServices(server);
    Server.loadControllers(router, 'controller/*', __dirname);
    console.table(listEndpoints(server))
  }
}
