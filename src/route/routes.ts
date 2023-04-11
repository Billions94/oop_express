import { Container, Service } from 'typedi';
import { Express } from 'express';
import { UserController } from '../user/controller/userController';
import { PostController } from '../post/controller/postController';

@Service()
export class Routes {
  private readonly USER_URL = '/api/users';
  private readonly POST_URL = '/api/posts';
  private readonly userController: UserController;
  private readonly postController: PostController;

  constructor(
    private readonly server: Express,
  ) {
    this.userController = Container.get(UserController);
    this.postController = Container.get(PostController);
  }

  initialize(): void {
    this.server.use(this.USER_URL, this.userController.init());
    this.server.use(this.POST_URL, this.postController.init());
  }
}