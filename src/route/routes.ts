import { Container, Service } from 'typedi';
import { Express } from 'express';
import { UserController } from '../user/controller/userController';
import { PostController } from '../post/controller/postController';
import { SpaceController } from '../spaces/controller/spaceController';

@Service()
export class Routes {
  private readonly userController: UserController;
  private readonly postController: PostController;
  private readonly spaceController: SpaceController;

  constructor(
    private readonly server: Express,
  ) {
    this.userController = Container.get(UserController);
    this.postController = Container.get(PostController);
    this.spaceController = Container.get(SpaceController);
  }

  initialize(): void {
    this.server.use('/api/users', this.userController.init());
    this.server.use('/api/posts', this.postController.init());
    this.server.use('/api/spaces', this.spaceController.init());
  }
}