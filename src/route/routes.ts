import { Express } from 'express';
import { UserController } from '../user/controller/userController';
import { PostController } from '../post/controller/postController';
import { SpaceController } from '../spaces/controller/spaceController';
import { Server } from 'typescript-rest';
import { Inject } from 'typescript-ioc';
import { Health } from '../health/health';

export class Routes {
  @Inject
  private readonly userController: UserController;
  @Inject
  private readonly postController: PostController;
  @Inject
  private readonly spaceController: SpaceController;
  @Inject
  private readonly healthCheck: Health

  constructor(private readonly server: Express) {}

  initialize(): void {
    Server.buildServices(this.server)
    Server.loadServices(this.userController.init(), '../user/controller/*', __dirname)
    Server.loadServices(this.postController.init(), '../post/controller/*', __dirname)
    Server.loadServices(this.spaceController.init(), '../spaces/controller/*', __dirname)
  }
}