import { Express, Router } from 'express';
import { UserController } from '../user/controller/userController';
import { PostController } from '../post/controller/postController';
import { SpaceController } from '../spaces/controller/spaceController';
import { Server } from 'typescript-rest';
import { Inject } from 'typescript-ioc';
import { Health } from '../health/health';

/**
 * Class for handling the routers and controllers
 */
export class Routes {
  @Inject
  private readonly userController: UserController;
  @Inject
  private readonly postController: PostController;
  @Inject
  private readonly spaceController: SpaceController;
  @Inject
  private readonly healthCheck: Health;

  /**
   * @remarks This is a custom method.
   * Creates routes for all classes we annotate with decorators from typescript-rest
   * and utilizes all our controllers we specify in the patterns
   * @param server - Express Application Server.
   * @returns A of type of void.
   * @beta
   */
  initialize(server: Express): void {
    const router = Router();
    Server.buildServices(server);
    Server.loadControllers(router, 'controller/*', __dirname);
  }
}
